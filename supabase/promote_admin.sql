-- Run ONCE in the Supabase SQL editor after creating the staff login in
-- Authentication → Users → "Add user" (email + password, "Auto confirm user" on).
-- The SQL editor runs with full rights, so this is the only way to grant admin.

update public.profiles
   set role = 'admin', name = 'Suzy''s Team'
 where email = 'admin@suzyscleaners.com';

-- Check it worked:
select id, email, role from public.profiles where role = 'admin';
