export type CatalogProduct = {
  id: string;
  slug: string;
  title: string;
  brand: string | null;
  cas_primary: string | null;
  catalog_code: string | null;
  description: string | null;
  product_type: string | null;
  api_family: string | null;
  product_format: string | null;
  promotion: boolean;
  fulfillment_city: string | null;
  fulfillment_state: string | null;
  moq_display: string | null;
  price_per_kg: number | null;
  min_order_kg: number | null;
  image_url: string | null;
  purity_grade: string | null;
};

export type ProductDetail = CatalogProduct & {
  iupac_name: string | null;
  formula: string | null;
  pubchem_cid: string | null;
  specs: Record<string, string | number | null>;
  coa_url: string | null;
  sds_url: string | null;
  ghs_codes: string[];
  hazards: string;
  storage: string;
  reviews: { rating: number; body: string; author: string }[];
  variants: {
    id: string;
    sku_code: string;
    pack_label: string;
    unit: string;
    pack_size: number;
    shelf_life: string | null;
    hsn_code: string | null;
    in_stock: boolean;
    tiers: { min_qty: number; unit_price: number; currency: string }[];
  }[];
};
