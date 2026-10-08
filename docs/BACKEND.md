# Connecting a production backend

The app talks to data through one interface: `Backend` in
[`src/services/backend/types.ts`](../src/services/backend/types.ts). The demo
ships with `LocalBackend` (on-device storage). To go live, add an adapter that
implements the same interface and select it in
[`src/services/backend/index.ts`](../src/services/backend/index.ts). No screen
or component needs to change.

```
src/services/backend/
  types.ts                 ← the contract (auth, catalog, orders, messages, notifications, admin, subscribe)
  index.ts                 ← picks the adapter from EXPO_PUBLIC_BACKEND / app.json extra.backend
  local/LocalBackend.ts    ← demo adapter (AsyncStorage + SecureStore)
  supabase/…               ← add this
```

## Supabase (recommended)

### 1. Tables

```sql
create type user_role as enum ('customer', 'admin');
create type order_status as enum (
  'request_received','pickup_confirmed','driver_on_the_way','picked_up',
  'cleaning_in_progress','ready_for_pickup','ready_for_delivery',
  'out_for_delivery','completed','cancelled');

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  role user_role not null default 'customer',
  name text not null,
  email text not null,
  phone text,
  addresses jsonb not null default '[]',
  default_address_id text,
  push_token text,
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table services (
  id text primary key, name text, tagline text, description text,
  highlights text[], price numeric, unit_label text, icon text, image text,
  active boolean, bookable boolean, sort_order int
);

create table settings (id int primary key default 1, data jsonb not null);

create sequence order_number start 1047;
create table orders (
  id uuid primary key default gen_random_uuid(),
  number int not null default nextval('order_number'),
  customer_id uuid not null references profiles(id),
  customer_name text, customer_phone text, customer_email text,
  pickup_address jsonb not null, delivery_address jsonb not null,
  pickup_date date not null, time_window text not null,
  lines jsonb not null, instructions text default '',
  estimated_total numeric not null, final_total numeric,
  status order_status not null default 'request_received',
  history jsonb not null default '[]',
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references profiles(id),
  sender text not null check (sender in ('customer','admin','system')),
  sender_name text, body text not null, order_id uuid references orders(id),
  topic text, created_at timestamptz default now(),
  read_by_customer boolean default false, read_by_admin boolean default false
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  title text, body text, order_id uuid, status order_status,
  created_at timestamptz default now(), read boolean default false
);
```

### 2. Role-based security (RLS)

Customers can only ever touch their own rows, and anything administrative
requires `role = 'admin'` on the server. This is what actually keeps customers
out of the Admin Dashboard. The app's route guards are only a convenience on
top of it.

```sql
create function is_admin() returns boolean language sql stable security definer as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'admin')
$$;

alter table profiles enable row level security;
create policy "own profile" on profiles for select using (id = auth.uid() or is_admin());
create policy "update own profile" on profiles for update using (id = auth.uid())
  with check (role = (select role from profiles where id = auth.uid())); -- can't self-promote

alter table orders enable row level security;
create policy "read own orders" on orders for select using (customer_id = auth.uid() or is_admin());
create policy "create own orders" on orders for insert with check (customer_id = auth.uid() and status = 'request_received');
create policy "admin updates orders" on orders for update using (is_admin());

alter table messages enable row level security;
create policy "read own thread" on messages for select using (customer_id = auth.uid() or is_admin());
create policy "customer writes own thread" on messages for insert with check (customer_id = auth.uid() and sender = 'customer');
create policy "admin writes any thread" on messages for insert with check (is_admin() and sender in ('admin','system'));

alter table notifications enable row level security;
create policy "read own notifications" on notifications for select using (user_id = auth.uid());
create policy "admin creates notifications" on notifications for insert with check (is_admin());

alter table services enable row level security;
create policy "public read" on services for select using (true);
create policy "admin manage" on services for all using (is_admin());

alter table settings enable row level security;
create policy "public read" on settings for select using (true);
create policy "admin manage" on settings for all using (is_admin());
```

Create the staff account in Supabase Auth, then run
`update profiles set role = 'admin' where email = 'admin@suzyscleaners.com';`.
After that, delete `src/config/demo.ts`.

### 3. Server-side rules

Move these checks from `LocalBackend` into a Postgres function or Edge
Function:

- **Order creation:** recompute prices from `services`, enforce the minimum
  order, and validate the service radius with a geocoder (Google Places or
  Mapbox).
- **Order status update** (`admin.updateOrder`): append to `history`, insert
  the notification and message rows, then send the push through the Expo Push
  API using `profiles.push_token`. Set `clientSidePush: false` in
  `src/config/env.ts`.

### 4. Realtime

`Backend.subscribe` maps to Supabase channels. Emit the matching topic
(`orders`, `messages`, `notifications`, …) on `postgres_changes`, and every
screen refreshes automatically.

## Firebase alternative

The same model works with Firebase:

- Firebase Auth with an `admin` custom claim.
- Firestore collections that mirror the tables above.
- Security rules that check `request.auth.token.admin == true`.
- A Cloud Function on `orders/{id}` updates that sends the push.

## Payments, maps and push

- **Payments:** add `payments.createIntent(orderId)` to the contract and back
  it with Stripe (`@stripe/stripe-react-native`). Charge `finalTotal` once
  staff set it.
- **Maps:** replace `locateAddress` in `src/services/serviceArea.ts` with
  Places autocomplete, which also provides lat/lng.
- **Push:** run `npx eas-cli init` so `extra.eas.projectId` is set, then build
  a development or production build. Expo Go cannot receive remote pushes on
  Android.
