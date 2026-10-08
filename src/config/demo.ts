/**
 * DEMO CREDENTIALS — local adapter only.
 *
 * The admin account is seeded with a salted SHA-256 hash; the plain-text
 * password is never stored by the app. When you move to Supabase / Firebase,
 * delete this file, create the staff user in your auth provider and give it
 * the `admin` role claim (see docs/BACKEND.md).
 *
 *   Admin:    admin@suzyscleaners.com / SuzyAdmin2026!
 *   Customer: demo@suzyscleaners.com  / Demo1234!
 */
export const DEMO_ADMIN = {
  id: 'usr-admin',
  email: 'admin@suzyscleaners.com',
  name: "Suzy's Team",
  phone: '(747) 333-0034',
  salt: 'admin-salt-7f3a',
  passwordHash: 'aeaf33056791d8470f867c7ce46f028886366c3e6f74d664d5be0b3056d27117',
};

export const DEMO_CUSTOMER = {
  id: 'usr-demo',
  email: 'demo@suzyscleaners.com',
  salt: 'demo-salt-19c2',
  passwordHash: 'a2edf17421dc98b322b31f2f1563f1bb1e7962046f7d5379b05a736ea48a8b70',
};
