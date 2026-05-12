/** Minimal Supabase generated types — extend after `supabase gen types`. */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          locale_pref: string | null;
          role: "platform_admin" | "vendor_staff" | "buyer_user";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          locale_pref?: string | null;
          role?: "platform_admin" | "vendor_staff" | "buyer_user";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          locale_pref?: string | null;
          role?: "platform_admin" | "vendor_staff" | "buyer_user";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          type: "buyer" | "vendor";
          legal_name: string;
          gstin: string | null;
          default_hsn_code: string | null;
          billing_address: Json;
          shipping_address: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          vendor_org_id: string;
          category_id: string | null;
          slug: string;
          title: string;
          description: string | null;
          cas_primary: string | null;
          iupac_name: string | null;
          formula: string | null;
          pubchem_cid: string | null;
          chemical_image_url: string | null;
          specs: Json;
          status: "draft" | "pending_review" | "published" | "archived";
          moq_display: string | null;
          promotion: boolean;
          api_family: string | null;
          product_type: string | null;
          brand: string | null;
          accreditation_product: string | null;
          accreditation_lab: string | null;
          analyte: string | null;
          product_format: string | null;
          impurity_type: string | null;
          sil_type: string | null;
          matrix: string | null;
          fulfillment_city: string | null;
          fulfillment_state: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku_code: string;
          pack_label: string;
          unit: string;
          pack_size: number;
          shelf_life: string | null;
          appearance: string | null;
          hsn_code: string | null;
          lead_time_days: number | null;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      price_tiers: {
        Row: {
          id: string;
          variant_id: string;
          min_qty: number;
          unit_price: number;
          currency: string;
          created_at: string;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
      inventory_snapshots: {
        Row: {
          variant_id: string;
          quantity_available: number;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: Record<string, never>;
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
