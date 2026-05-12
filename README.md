# Bip Mp (`bip-mp`)

B2B chemical marketplace (Next.js 15 + Supabase/Postgres). **Display name:** Bip Mp · **npm package folder:** `bip-mp` (lowercase; npm naming).

## Quick start

```bash
cd bip-mp
npm install
cp .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000` — middleware redirects to a locale (e.g. `/en`).

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_DEMO_SHOW_PRICES` | Set to `true` to show list/PDP prices **without** auth (demo only) |

## Database

SQL migrations live in [`supabase/migrations`](./supabase/migrations). Apply with [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase db push
```

After linking, regenerate types: `supabase gen types typescript --linked > src/lib/database.types.ts`

## RLS summary

| Area | Policy idea |
|------|-------------|
| `products` | Public sees `published`; vendor staff + admin see drafts for their org |
| `price_tiers` | No anonymous access; buyers (`buyer_user`), vendor staff, admins can `SELECT` |
| `organizations` / `organization_members` | Members see their org; first user can join an empty org |
| `vendor_profiles` | Vendor staff + platform admin |
| `webhook_endpoints`, `search_index_jobs` | Vendor org + admin (ERP / search phase-2) |

## API stubs

- `GET /api/pubchem?cas=` — PubChem proxy
- `POST /api/vendor/parse-csv` — CSV validation (Papa Parse)
- `POST /api/webhooks/erp` — ERP inbound log stub
- `POST /api/search/reindex` — Search index job stub

## Routes

- `/[locale]/` — Home, categories
- `/[locale]/catalog` — PLP + filters
- `/[locale]/products/[slug]` — PDP tabs, gated price, PubChem diagram
- `/[locale]/account` — Buyer org + GSTIN demo
- `/[locale]/vendor/onboarding` — 5-step wizard
- `/[locale]/vendor/import` — CSV paste + parse
- `/[locale]/admin/*` — Admin queue placeholders

Without Supabase env, the app uses **demo catalog** data so UI and builds work offline.
