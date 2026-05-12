-- Reference seed for Supabase (run in SQL Editor after schema matches src/lib/database.types.ts).
-- Adjust UUIDs if they already exist. See docs/DEMO_ACCESS.md for Auth + profiles.

begin;

insert into public.organizations (id, type, legal_name, gstin, default_hsn_code, billing_address, shipping_address, created_at, updated_at)
values (
  'a0000000-0000-4000-8000-000000000001',
  'vendor',
  'Demo Vendor Labs',
  null,
  null,
  '{}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
) on conflict (id) do nothing;

insert into public.products (
  id,
  vendor_org_id,
  category_id,
  slug,
  title,
  description,
  cas_primary,
  iupac_name,
  formula,
  pubchem_cid,
  chemical_image_url,
  specs,
  status,
  moq_display,
  promotion,
  api_family,
  product_type,
  brand,
  accreditation_product,
  accreditation_lab,
  analyte,
  product_format,
  impurity_type,
  sil_type,
  matrix,
  fulfillment_city,
  fulfillment_state,
  created_at,
  updated_at
)
values (
  'b0000000-0000-4000-8000-000000000001',
  'a0000000-0000-4000-8000-000000000001',
  null,
  'seed-acetonitrile-hplc',
  'Acetonitrile HPLC grade (seed)',
  'Seeded demo listing for production checks.',
  '75-05-8',
  'Acetonitrile',
  'C2H3N',
  '6344',
  'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/6344/PNG?record_type=2d&image_size=400x400',
  jsonb_build_object(
    'purity', '>= 99.9 %',
    'category_slugs', jsonb_build_array('solvents'),
    'promotion_tags', jsonb_build_array()
  ),
  'published',
  '4 L bottle',
  false,
  'Nitriles',
  'Chromatography solvent',
  'ChromLab',
  null,
  'ISO 17025',
  'Acetonitrile',
  'Liquid',
  'Degradation product',
  '—',
  'Single solution',
  'Hyderabad',
  'Telangana',
  now(),
  now()
) on conflict (id) do nothing;

insert into public.product_variants (
  id,
  product_id,
  sku_code,
  pack_label,
  unit,
  pack_size,
  shelf_life,
  appearance,
  hsn_code,
  lead_time_days,
  created_at
)
values (
  'c0000000-0000-4000-8000-000000000001',
  'b0000000-0000-4000-8000-000000000001',
  'SEED-CH3CN-4L',
  '4 L glass bottle',
  'L',
  4,
  '36 months',
  null,
  '29269099',
  3,
  now()
) on conflict (id) do nothing;

insert into public.price_tiers (id, variant_id, min_qty, unit_price, currency, created_at)
values (
  'd0000000-0000-4000-8000-000000000001',
  'c0000000-0000-4000-8000-000000000001',
  4,
  890,
  'INR',
  now()
) on conflict (id) do nothing;

insert into public.inventory_snapshots (variant_id, quantity_available, updated_at, updated_by)
values (
  'c0000000-0000-4000-8000-000000000001',
  120,
  now(),
  null
) on conflict (variant_id) do update set quantity_available = excluded.quantity_available, updated_at = excluded.updated_at;

commit;
