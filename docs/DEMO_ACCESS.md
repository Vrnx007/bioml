# Demo access (Supabase Auth + profiles)

Emails and password are also shown on **`/{locale}/auth/login`** and defined in code at **`src/lib/demo-auth.ts`**. Either run the seed script below (recommended) or create users manually in Supabase Auth, then add matching `profiles` rows.

## Apply the database schema first (required)

The app and seed script expect tables such as **`public.profiles`**. On a new Supabase project, run the migration **before** `npm run seed:demo-users`:

1. Open **`supabase/migrations/20250512000001_initial_schema.sql`** in this repo.
2. In **Supabase Dashboard → SQL Editor**, paste the full file and **Run** (use a fresh project, or adjust if you already have conflicting objects).

If you skip this step, the seed script can create Auth users but will fail with *Could not find the table `public.profiles` in the schema cache* (`PGRST205`). After the migration succeeds, run the seed again.

---

## Seed Auth + profiles automatically (recommended)

1. In **Supabase Dashboard → Settings → API**, copy **Project URL**, **anon public**, and **service_role** (secret).
2. Put URL + anon in `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Add **`SUPABASE_SERVICE_ROLE_KEY`** (the service_role JWT) to `.env.local` only — never commit it.
4. Open a terminal **in the `bip-mp` folder** (the one that has `package.json` and `scripts/seed-demo-auth-users.mjs`), add the keys to **that** folder’s `.env.local`, then run:

```bash
npm run seed:demo-users
```

If you run the command from another project directory, the script will not see `.env.local` and will exit with “Missing Supabase env vars”.

This creates or updates the three demo users (password reset to the value below), confirms email, and upserts `public.profiles` with the correct `role`.

## Demo credentials (development)

| Role | Email | Password (set in Supabase) | `profiles.role` |
|------|--------|------------------------------|-----------------|
| Admin | `admin@demo.bip-mp.local` | `DemoBip2026!` | `platform_admin` |
| Vendor | `vendor@demo.bip-mp.local` | `DemoBip2026!` | `vendor_staff` |
| Buyer | `buyer@demo.bip-mp.local` | `DemoBip2026!` | `buyer_user` |

If you do **not** use `npm run seed:demo-users`, create each user in **Authentication → Users** with the password above, then run the profile SQL below with each user’s UUID.

---

## Manual alternative: insert profile rows

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

## Row Level Security

Ensure authenticated users can **select their own** profile row, for example:

```sql
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);
```

(Adjust if your project already defines stricter policies.)

---

## Sign in

With `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`, open `/{locale}/auth/login` (e.g. `/en/auth/login`) and sign in with the table above.

Sign out: `/{locale}/auth/sign-out`.

---

## Without Supabase

If those env vars are unset, the storefront uses the **in-repo demo catalog** and middleware **does not** enforce admin/vendor/account gates (no session server).
