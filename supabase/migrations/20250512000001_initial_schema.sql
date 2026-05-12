-- Bip Mp — Chemical B2B marketplace (Postgres + RLS)
-- Run via Supabase CLI or SQL editor after project link.

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enums
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('platform_admin', 'vendor_staff', 'buyer_user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.org_type AS ENUM ('buyer', 'vendor');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.product_status AS ENUM ('draft', 'pending_review', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.document_type AS ENUM ('coa', 'sds', 'iso_cert', 'reach', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.rfq_status AS ENUM ('open', 'quoted', 'closed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.order_status AS ENUM ('draft', 'placed', 'confirmed', 'fulfilled', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.review_moderation AS ENUM ('pending', 'published', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.vendor_onboarding AS ENUM (
    'registered',
    'profile',
    'catalog',
    'compliance',
    'live',
    'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Profiles (1:1 auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  locale_pref TEXT DEFAULT 'en' CHECK (locale_pref IN ('en', 'hi')),
  role public.app_role NOT NULL DEFAULT 'buyer_user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.org_type NOT NULL,
  legal_name TEXT NOT NULL,
  gstin TEXT,
  default_hsn_code TEXT,
  billing_address JSONB DEFAULT '{}'::jsonb,
  shipping_address JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.organization_members (
  org_id UUID NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  is_org_admin BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (org_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.vendor_profiles (
  org_id UUID PRIMARY KEY REFERENCES public.organizations (id) ON DELETE CASCADE,
  onboarding_step SMALLINT NOT NULL DEFAULT 1 CHECK (onboarding_step BETWEEN 1 AND 5),
  onboarding_status public.vendor_onboarding NOT NULL DEFAULT 'registered',
  bank_reference_id TEXT,
  gst_verified_at TIMESTAMPTZ,
  approved_by UUID REFERENCES public.profiles (id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_hi TEXT,
  parent_id UUID REFERENCES public.product_categories (id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_org_id UUID NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.product_categories (id) ON DELETE SET NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cas_primary TEXT,
  iupac_name TEXT,
  formula TEXT,
  pubchem_cid TEXT,
  chemical_image_url TEXT,
  specs JSONB NOT NULL DEFAULT '{}'::jsonb,
  status public.product_status NOT NULL DEFAULT 'draft',
  moq_display TEXT,
  promotion BOOLEAN NOT NULL DEFAULT false,
  api_family TEXT,
  product_type TEXT,
  brand TEXT,
  accreditation_product TEXT,
  accreditation_lab TEXT,
  analyte TEXT,
  product_format TEXT,
  impurity_type TEXT,
  sil_type TEXT,
  matrix TEXT,
  fulfillment_city TEXT,
  fulfillment_state TEXT,
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A')
    || setweight(to_tsvector('simple', coalesce(description, '')), 'B')
    || setweight(to_tsvector('simple', coalesce(cas_primary, '')), 'A')
    || setweight(to_tsvector('simple', coalesce(brand, '')), 'B')
    || setweight(to_tsvector('simple', coalesce(api_family, '')), 'C')
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (vendor_org_id, slug)
);

CREATE INDEX IF NOT EXISTS products_search_vector_idx ON public.products USING GIN (search_vector);
CREATE INDEX IF NOT EXISTS products_cas_trgm_idx ON public.products USING GIN (cas_primary gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_status_idx ON public.products (status);

CREATE TABLE IF NOT EXISTS public.product_identifiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  id_type TEXT NOT NULL CHECK (id_type IN ('catalog', 'cas', 'internal')),
  value TEXT NOT NULL,
  UNIQUE (product_id, id_type, value)
);

CREATE INDEX IF NOT EXISTS product_identifiers_value_trgm_idx ON public.product_identifiers USING GIN (value gin_trgm_ops);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  sku_code TEXT NOT NULL,
  pack_label TEXT NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('kg', 'g', 'L', 'mL', 'mg')),
  pack_size NUMERIC NOT NULL,
  shelf_life TEXT,
  appearance TEXT,
  hsn_code TEXT,
  lead_time_days INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, sku_code)
);

CREATE TABLE IF NOT EXISTS public.price_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES public.product_variants (id) ON DELETE CASCADE,
  min_qty NUMERIC NOT NULL,
  unit_price NUMERIC NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inventory_snapshots (
  variant_id UUID PRIMARY KEY REFERENCES public.product_variants (id) ON DELETE CASCADE,
  quantity_available NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.profiles (id)
);

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products (id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants (id) ON DELETE CASCADE,
  vendor_org_id UUID NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  doc_type public.document_type NOT NULL,
  storage_path TEXT NOT NULL,
  version INT NOT NULL DEFAULT 1,
  uploaded_by UUID REFERENCES public.profiles (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (product_id IS NOT NULL OR variant_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS public.rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_org_id UUID NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  vendor_org_id UUID NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  status public.rfq_status NOT NULL DEFAULT 'open',
  notes TEXT,
  created_by UUID REFERENCES public.profiles (id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rfq_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID NOT NULL REFERENCES public.rfqs (id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants (id) ON DELETE CASCADE,
  qty_requested NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  UNIQUE (rfq_id, variant_id)
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_org_id UUID NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  vendor_org_id UUID NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  status public.order_status NOT NULL DEFAULT 'draft',
  place_of_supply_state TEXT,
  gst_breakdown JSONB,
  invoice_number_stub TEXT,
  invoice_pdf_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants (id),
  qty NUMERIC NOT NULL,
  unit_price NUMERIC NOT NULL,
  line_total NUMERIC NOT NULL,
  hsn_code TEXT
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  buyer_user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body TEXT,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  moderation public.review_moderation NOT NULL DEFAULT 'pending',
  vendor_reply TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, buyer_user_id)
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_id UUID REFERENCES public.profiles (id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.webhook_endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_org_id UUID NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  secret_hmac TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT ARRAY['order.placed', 'inventory.updated']::text[],
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.search_index_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  vendor_org_id UUID NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, vendor_org_id)
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.carts (id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES public.product_variants (id) ON DELETE CASCADE,
  qty NUMERIC NOT NULL DEFAULT 1,
  UNIQUE (cart_id, variant_id)
);

-- Helper functions (SECURITY DEFINER for RLS ergonomics)
CREATE OR REPLACE FUNCTION public.jwt_role()
RETURNS TEXT LANGUAGE sql STABLE AS $$
  COALESCE((auth.jwt() ->> 'app_role'), '')
$$;

CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'platform_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_vendor_staff_of(org UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.organization_members m ON m.user_id = p.id
    WHERE p.id = auth.uid()
      AND p.role = 'vendor_staff'
      AND m.org_id = org
  );
$$;

CREATE OR REPLACE FUNCTION public.is_buyer_member_of(org UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.organization_members m ON m.user_id = p.id
    JOIN public.organizations o ON o.id = m.org_id
    WHERE p.id = auth.uid()
      AND p.role = 'buyer_user'
      AND o.type = 'buyer'
      AND m.org_id = org
  );
$$;

CREATE OR REPLACE FUNCTION public.can_view_product_row(p public.products)
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT
    p.status = 'published'
    OR public.is_platform_admin()
    OR public.is_vendor_staff_of(p.vendor_org_id);
$$;

-- Updated_at triggers
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_profiles_updated ON public.profiles;
CREATE TRIGGER tr_profiles_updated BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.touch_updated_at();

DROP TRIGGER IF EXISTS tr_orgs_updated ON public.organizations;
CREATE TRIGGER tr_orgs_updated BEFORE UPDATE ON public.organizations
FOR EACH ROW EXECUTE PROCEDURE public.touch_updated_at();

DROP TRIGGER IF EXISTS tr_vendor_profiles_updated ON public.vendor_profiles;
CREATE TRIGGER tr_vendor_profiles_updated BEFORE UPDATE ON public.vendor_profiles
FOR EACH ROW EXECUTE PROCEDURE public.touch_updated_at();

DROP TRIGGER IF EXISTS tr_products_updated ON public.products;
CREATE TRIGGER tr_products_updated BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE PROCEDURE public.touch_updated_at();

-- Auth: new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- RLS enable
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_index_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY profiles_select_self ON public.profiles FOR SELECT USING (id = auth.uid() OR public.is_platform_admin());
CREATE POLICY profiles_update_self ON public.profiles FOR UPDATE USING (id = auth.uid());

-- organizations: members + admin
CREATE POLICY orgs_select ON public.organizations FOR SELECT USING (
  public.is_platform_admin()
  OR EXISTS (SELECT 1 FROM public.organization_members m WHERE m.org_id = organizations.id AND m.user_id = auth.uid())
);
CREATE POLICY orgs_insert_authenticated ON public.organizations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY orgs_update_member ON public.organizations FOR UPDATE USING (
  public.is_platform_admin()
  OR EXISTS (
    SELECT 1 FROM public.organization_members m
    WHERE m.org_id = organizations.id AND m.user_id = auth.uid() AND m.is_org_admin
  )
);

-- organization_members
CREATE POLICY om_select ON public.organization_members FOR SELECT USING (
  public.is_platform_admin() OR user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM public.organization_members x WHERE x.org_id = organization_members.org_id AND x.user_id = auth.uid())
);
CREATE POLICY om_insert ON public.organization_members FOR INSERT WITH CHECK (
  public.is_platform_admin()
  OR (
    user_id = auth.uid()
    AND NOT EXISTS (SELECT 1 FROM public.organization_members x WHERE x.org_id = organization_members.org_id)
  )
  OR EXISTS (
    SELECT 1 FROM public.organization_members x
    WHERE x.org_id = organization_members.org_id AND x.user_id = auth.uid() AND x.is_org_admin
  )
);
CREATE POLICY om_delete ON public.organization_members FOR DELETE USING (public.is_platform_admin());

-- vendor_profiles
CREATE POLICY vp_select ON public.vendor_profiles FOR SELECT USING (
  public.is_platform_admin() OR public.is_vendor_staff_of(org_id)
);
CREATE POLICY vp_upsert_vendor ON public.vendor_profiles FOR ALL USING (
  public.is_platform_admin() OR public.is_vendor_staff_of(org_id)
) WITH CHECK (
  public.is_platform_admin() OR public.is_vendor_staff_of(org_id)
);

-- product_categories: public read; admin write
CREATE POLICY pc_read ON public.product_categories FOR SELECT USING (true);
CREATE POLICY pc_write ON public.product_categories FOR ALL USING (public.is_platform_admin()) WITH CHECK (public.is_platform_admin());

-- products
CREATE POLICY products_select ON public.products FOR SELECT USING (public.can_view_product_row(products));
CREATE POLICY products_insert_vendor ON public.products FOR INSERT WITH CHECK (
  public.is_platform_admin() OR public.is_vendor_staff_of(vendor_org_id)
);
CREATE POLICY products_update_vendor ON public.products FOR UPDATE USING (
  public.is_platform_admin() OR public.is_vendor_staff_of(vendor_org_id)
);
CREATE POLICY products_delete_vendor ON public.products FOR DELETE USING (
  public.is_platform_admin() OR public.is_vendor_staff_of(vendor_org_id)
);

-- identifiers: follow product visibility
CREATE POLICY pid_select ON public.product_identifiers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_identifiers.product_id AND public.can_view_product_row(p))
);
CREATE POLICY pid_write ON public.product_identifiers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_identifiers.product_id AND (public.is_platform_admin() OR public.is_vendor_staff_of(p.vendor_org_id)))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_identifiers.product_id AND (public.is_platform_admin() OR public.is_vendor_staff_of(p.vendor_org_id)))
);

-- variants: visible if product visible
CREATE POLICY pv_select ON public.product_variants FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_variants.product_id AND public.can_view_product_row(p))
);
CREATE POLICY pv_write ON public.product_variants FOR ALL USING (
  EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_variants.product_id AND (public.is_platform_admin() OR public.is_vendor_staff_of(p.vendor_org_id)))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_variants.product_id AND (public.is_platform_admin() OR public.is_vendor_staff_of(p.vendor_org_id)))
);

-- price tiers: gated — authenticated buyers, vendor staff, admin (anonymous cannot price)
CREATE POLICY pt_select ON public.price_tiers FOR SELECT USING (
  public.is_platform_admin()
  OR EXISTS (
    SELECT 1 FROM public.product_variants v
    JOIN public.products p ON p.id = v.product_id
    WHERE v.id = price_tiers.variant_id
      AND (
        public.is_vendor_staff_of(p.vendor_org_id)
        OR (
          auth.uid() IS NOT NULL
          AND EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.id = auth.uid() AND pr.role = 'buyer_user')
        )
      )
  )
);
CREATE POLICY pt_write ON public.price_tiers FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.product_variants v
    JOIN public.products p ON p.id = v.product_id
    WHERE v.id = price_tiers.variant_id
      AND (public.is_platform_admin() OR public.is_vendor_staff_of(p.vendor_org_id))
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.product_variants v
    JOIN public.products p ON p.id = v.product_id
    WHERE v.id = price_tiers.variant_id
      AND (public.is_platform_admin() OR public.is_vendor_staff_of(p.vendor_org_id))
  )
);

-- inventory
CREATE POLICY inv_select ON public.inventory_snapshots FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.product_variants v
    JOIN public.products p ON p.id = v.product_id
    WHERE v.id = inventory_snapshots.variant_id
      AND public.can_view_product_row(p)
  )
);
CREATE POLICY inv_write ON public.inventory_snapshots FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.product_variants v
    JOIN public.products p ON p.id = v.product_id
    WHERE v.id = inventory_snapshots.variant_id
      AND (public.is_platform_admin() OR public.is_vendor_staff_of(p.vendor_org_id))
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.product_variants v
    JOIN public.products p ON p.id = v.product_id
    WHERE v.id = inventory_snapshots.variant_id
      AND (public.is_platform_admin() OR public.is_vendor_staff_of(p.vendor_org_id))
  )
);

-- documents: same visibility as product for read; vendor writes
CREATE POLICY doc_select ON public.documents FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.products p
    WHERE p.id = documents.product_id AND public.can_view_product_row(p)
  )
  OR EXISTS (
    SELECT 1 FROM public.product_variants v
    JOIN public.products p ON p.id = v.product_id
    WHERE v.id = documents.variant_id AND public.can_view_product_row(p)
  )
  OR public.is_vendor_staff_of(vendor_org_id)
  OR public.is_platform_admin()
);
CREATE POLICY doc_write ON public.documents FOR ALL USING (
  public.is_platform_admin() OR public.is_vendor_staff_of(vendor_org_id)
) WITH CHECK (
  public.is_platform_admin() OR public.is_vendor_staff_of(vendor_org_id)
);

-- RFQs
CREATE POLICY rfq_select ON public.rfqs FOR SELECT USING (
  public.is_platform_admin()
  OR public.is_buyer_member_of(buyer_org_id)
  OR public.is_vendor_staff_of(vendor_org_id)
);
CREATE POLICY rfq_insert_buyer ON public.rfqs FOR INSERT WITH CHECK (
  public.is_buyer_member_of(buyer_org_id) OR public.is_platform_admin()
);
CREATE POLICY rfq_update ON public.rfqs FOR UPDATE USING (
  public.is_platform_admin()
  OR public.is_buyer_member_of(buyer_org_id)
  OR public.is_vendor_staff_of(vendor_org_id)
);

CREATE POLICY rfl_select ON public.rfq_lines FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.rfqs r WHERE r.id = rfq_lines.rfq_id AND (
    public.is_platform_admin()
    OR public.is_buyer_member_of(r.buyer_org_id)
    OR public.is_vendor_staff_of(r.vendor_org_id)
  ))
);
CREATE POLICY rfl_write ON public.rfq_lines FOR ALL USING (
  EXISTS (SELECT 1 FROM public.rfqs r WHERE r.id = rfq_lines.rfq_id AND (
    public.is_platform_admin() OR public.is_buyer_member_of(r.buyer_org_id)
  ))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.rfqs r WHERE r.id = rfq_lines.rfq_id AND (
    public.is_platform_admin() OR public.is_buyer_member_of(r.buyer_org_id)
  ))
);

-- orders
CREATE POLICY ord_select ON public.orders FOR SELECT USING (
  public.is_platform_admin()
  OR public.is_buyer_member_of(buyer_org_id)
  OR public.is_vendor_staff_of(vendor_org_id)
);
CREATE POLICY ord_write ON public.orders FOR ALL USING (
  public.is_platform_admin()
  OR public.is_buyer_member_of(buyer_org_id)
  OR public.is_vendor_staff_of(vendor_org_id)
) WITH CHECK (
  public.is_platform_admin()
  OR public.is_buyer_member_of(buyer_org_id)
  OR public.is_vendor_staff_of(vendor_org_id)
);

CREATE POLICY ol_select ON public.order_lines FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_lines.order_id AND (
    public.is_platform_admin()
    OR public.is_buyer_member_of(o.buyer_org_id)
    OR public.is_vendor_staff_of(o.vendor_org_id)
  ))
);
CREATE POLICY ol_write ON public.order_lines FOR ALL USING (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_lines.order_id AND (
    public.is_platform_admin()
    OR public.is_buyer_member_of(o.buyer_org_id)
    OR public.is_vendor_staff_of(o.vendor_org_id)
  ))
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_lines.order_id AND (
    public.is_platform_admin()
    OR public.is_buyer_member_of(o.buyer_org_id)
    OR public.is_vendor_staff_of(o.vendor_org_id)
  ))
);

-- reviews: public read published; buyers write own pending
CREATE POLICY rev_select ON public.reviews FOR SELECT USING (
  moderation = 'published' OR buyer_user_id = auth.uid() OR public.is_platform_admin()
  OR EXISTS (SELECT 1 FROM public.products p WHERE p.id = reviews.product_id AND public.is_vendor_staff_of(p.vendor_org_id))
);
CREATE POLICY rev_insert ON public.reviews FOR INSERT WITH CHECK (buyer_user_id = auth.uid());
CREATE POLICY rev_update ON public.reviews FOR UPDATE USING (
  buyer_user_id = auth.uid() OR public.is_platform_admin()
  OR EXISTS (SELECT 1 FROM public.products p WHERE p.id = reviews.product_id AND public.is_vendor_staff_of(p.vendor_org_id))
);

-- audit logs: admin only
CREATE POLICY audit_select ON public.audit_logs FOR SELECT USING (public.is_platform_admin());
CREATE POLICY audit_insert ON public.audit_logs FOR INSERT WITH CHECK (public.is_platform_admin() OR actor_id = auth.uid());

-- webhook_endpoints: vendor org + admin
CREATE POLICY wh_select ON public.webhook_endpoints FOR SELECT USING (
  public.is_platform_admin() OR public.is_vendor_staff_of(vendor_org_id)
);
CREATE POLICY wh_write ON public.webhook_endpoints FOR ALL USING (
  public.is_platform_admin() OR public.is_vendor_staff_of(vendor_org_id)
) WITH CHECK (
  public.is_platform_admin() OR public.is_vendor_staff_of(vendor_org_id)
);

-- search_index_jobs: admin + vendor of product
CREATE POLICY sij_select ON public.search_index_jobs FOR SELECT USING (
  public.is_platform_admin()
  OR EXISTS (SELECT 1 FROM public.products p WHERE p.id = search_index_jobs.product_id AND public.is_vendor_staff_of(p.vendor_org_id))
);
CREATE POLICY sij_write ON public.search_index_jobs FOR ALL USING (
  public.is_platform_admin()
  OR EXISTS (SELECT 1 FROM public.products p WHERE p.id = search_index_jobs.product_id AND public.is_vendor_staff_of(p.vendor_org_id))
) WITH CHECK (
  public.is_platform_admin()
  OR EXISTS (SELECT 1 FROM public.products p WHERE p.id = search_index_jobs.product_id AND public.is_vendor_staff_of(p.vendor_org_id))
);

-- carts
CREATE POLICY carts_all ON public.carts FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY cart_items_all ON public.cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND c.user_id = auth.uid())
);

-- Grants
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
-- anon: only published product paths — restricted by RLS (products select uses can_view for published; price_tiers deny anon)

COMMENT ON TABLE public.orders IS 'GST place_of_supply_state and gst_breakdown reserved for India invoicing.';
COMMENT ON TABLE public.webhook_endpoints IS 'Phase-2 ERP outbound integration; HMAC secret stored server-side only in app.';
