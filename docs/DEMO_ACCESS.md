# Demo access (Supabase Auth + profiles)

This app gates **Admin** (`/{locale}/admin`) and **Vendor** (`/{locale}/vendor`) with Supabase session + `public.profiles.role`.

## 1. Create Auth users

In the Supabase Dashboard: **Authentication → Users → Add user**.

Suggested emails (set passwords in the Dashboard; **do not** commit passwords to git):

| Role | Email (example) | `profiles.role` |
|------|-----------------|-----------------|
| Platform admin | `admin-demo@yourdomain.com` | `platform_admin` |
| Vendor staff | `vendor-demo@yourdomain.com` | `vendor_staff` |
| Buyer | `buyer-demo@yourdomain.com` | `buyer_user` |

## 2. Insert profile rows

After each user is created, copy their UUID from the Users table and run in **SQL Editor** (replace `USER_UUID`):

```sql
insert into public.profiles (id, email, full_name, role)
values (
  'USER_UUID'::uuid,
  'admin-demo@yourdomain.com',
  'Demo Admin',
  'platform_admin'
)
on conflict (id) do update set role = excluded.role, email = excluded.email;
```

Repeat for `vendor_staff` and `buyer_user` with the corresponding user ids.

## 3. Row Level Security

Ensure authenticated users can **select their own** profile row, for example:

```sql
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);
```

(Adjust if your project already defines stricter policies.)

## 4. Local sign-in

With `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`, open `/{locale}/auth/login` (e.g. `/en/auth/login`) and sign in with the demo users you created.

Sign out: `/{locale}/auth/sign-out`.

## 5. Without Supabase

If those env vars are unset, the storefront uses the **in-repo demo catalog** and middleware **does not** enforce admin/vendor (no session server).
