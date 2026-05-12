# Demo access (Supabase Auth + profiles)

Use these **demo credentials** in Supabase Auth (create each user with the same password), then add matching `profiles` rows.

## Demo credentials (development)

| Role | Email | Password (set in Supabase) | `profiles.role` |
|------|--------|------------------------------|-----------------|
| Admin | `admin@demo.bip-mp.local` | `DemoBip2026!` | `platform_admin` |
| Vendor | `vendor@demo.bip-mp.local` | `DemoBip2026!` | `vendor_staff` |
| Buyer | `buyer@demo.bip-mp.local` | `DemoBip2026!` | `buyer_user` |

Create each user in **Authentication → Users** with the password above, then run the profile SQL below with each user’s UUID.

---

## 1. Insert profile rows

After each user exists, copy their UUID from the Users table and run in **SQL Editor** (replace `USER_UUID` and email):

```sql
insert into public.profiles (id, email, full_name, role)
values (
  'USER_UUID'::uuid,
  'admin@demo.bip-mp.local',
  'Demo Admin',
  'platform_admin'
)
on conflict (id) do update set role = excluded.role, email = excluded.email;
```

Repeat for `vendor@demo.bip-mp.local` / `vendor_staff` and `buyer@demo.bip-mp.local` / `buyer_user`.

---

## 2. Row Level Security

Ensure authenticated users can **select their own** profile row, for example:

```sql
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);
```

(Adjust if your project already defines stricter policies.)

---

## 3. Sign in

With `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`, open `/{locale}/auth/login` (e.g. `/en/auth/login`) and sign in with the table above.

Sign out: `/{locale}/auth/sign-out`.

---

## 4. Without Supabase

If those env vars are unset, the storefront uses the **in-repo demo catalog** and middleware **does not** enforce admin/vendor/account gates (no session server).
