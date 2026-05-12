# Row-level security matrix (summary)

Policies are defined in `supabase/migrations/20250512000001_initial_schema.sql`.

| Table | SELECT | INSERT/UPDATE |
|-------|--------|----------------|
| profiles | Self + admin | Update self |
| organizations | Members + admin | Authenticated create |
| organization_members | Same org + admin | First member of org, org admin, or admin |
| vendor_profiles | Vendor staff of org + admin | Vendor staff + admin |
| product_categories | Public | Admin |
| products | Published OR vendor of row OR admin | Vendor staff of vendor_org_id |
| product_identifiers / product_variants | If parent product visible / vendor | Vendor |
| price_tiers | Buyer (role) OR vendor OR admin — **not** anon | Vendor |
| inventory_snapshots | If product visible | Vendor |
| documents | Published product OR vendor/admin | Vendor |
| rfqs / rfq_lines | Buyer org or vendor org or admin | Buyer creates |
| orders / order_lines | Buyer or vendor or admin | Same |
| reviews | Published OR author OR vendor of product OR admin | Buyer inserts own |
| audit_logs | Admin | Admin or self actor |
| webhook_endpoints / search_index_jobs | Vendor org + admin | Vendor + admin |
| carts / cart_items | Owner user | Owner user |

Helper functions: `is_platform_admin()`, `is_vendor_staff_of(uuid)`, `is_buyer_member_of(uuid)`, `can_view_product_row(products)`.
