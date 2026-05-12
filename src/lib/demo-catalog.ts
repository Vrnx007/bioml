import type { CatalogProduct, ProductDetail } from "@/lib/types";
import { demoCatalog } from "@/lib/demo-catalog-seed";

export const DEMO_VENDOR_ORG_ID = "00000000-0000-0000-0000-00000000d001";

function cidFromImage(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/\/cid\/(\d+)\//);
  return m?.[1] ?? null;
}

function defaultSpecs(p: CatalogProduct): ProductDetail["specs"] {
  return {
    purity: p.purity_grade ?? "—",
    grade: "See CoA",
    appearance: "See SDS",
    country_of_origin: "India",
    tariff_code: "—",
  };
}

function buildDetail(p: CatalogProduct): ProductDetail {
  const cid = cidFromImage(p.image_url);
  return {
    ...p,
    iupac_name: p.title,
    formula: "—",
    pubchem_cid: cid,
    specs: defaultSpecs(p),
    coa_url: "#demo-coa",
    sds_url: "#demo-sds",
    ghs_codes: ["GHS07"],
    hazards: "Refer to SDS before handling.",
    storage: "Store as per label and SDS.",
    reviews: [],
    variants: [
      {
        id: `v-${p.id}`,
        sku_code: p.catalog_code ?? p.id,
        pack_label: p.moq_display ?? "1 unit",
        unit: "kg",
        pack_size: Math.max(p.min_order_kg ?? 1, 0.001),
        shelf_life: "24 months",
        hsn_code: "9999",
        in_stock: true,
        tiers:
          p.price_per_kg != null
            ? [
                { min_qty: p.min_order_kg ?? 1, unit_price: p.price_per_kg * (p.min_order_kg ?? 1), currency: "INR" },
              ]
            : [{ min_qty: 1, unit_price: 0, currency: "INR" }],
      },
    ],
  };
}

const details: Record<string, ProductDetail> = Object.fromEntries(demoCatalog.map((p) => [p.slug, buildDetail(p)]));

/** Enrich a few flagship PDPs */
details["benzalkonium-chloride-mm0224"] = {
  ...details["benzalkonium-chloride-mm0224"]!,
  iupac_name: "benzyl-dodecyl-dimethylazanium; chloride",
  formula: "C21H42NO·Cl (representative)",
  specs: {
    purity: "≥ 95 % (typical)",
    grade: "Ph. Eur.",
    appearance: "White to off-white powder",
    country_of_origin: "Germany",
    tariff_code: "34021200",
  },
  ghs_codes: ["GHS07"],
  hazards: "Causes skin irritation. Causes serious eye damage.",
  storage: "Cool dry place.",
  reviews: [
    { rating: 5, body: "CoA matched UPLC; fast dispatch.", author: "QC Lead" },
  ],
};

details["sodium-hydroxide-flakes"] = {
  ...details["sodium-hydroxide-flakes"]!,
  iupac_name: "Sodium hydroxide",
  formula: "NaOH",
  specs: {
    purity: "≥ 98 %",
    grade: "Industrial / AR",
    appearance: "White flakes",
    country_of_origin: "India",
    tariff_code: "28151100",
  },
  ghs_codes: ["GHS05", "GHS07"],
  hazards: "Corrosive.",
  storage: "Dry ventilated area.",
  reviews: [{ rating: 4, body: "Consistent drums.", author: "Plant buyer" }],
};

details["acetonitrile-hplc"] = {
  ...details["acetonitrile-hplc"]!,
  iupac_name: "Acetonitrile",
  formula: "C2H3N",
  specs: {
    purity: "≥ 99.9 %",
    grade: "HPLC",
    appearance: "Clear liquid",
    country_of_origin: "India",
    tariff_code: "29269099",
  },
  ghs_codes: ["GHS02", "GHS07"],
  hazards: "Highly flammable liquid and vapour.",
  storage: "Away from heat/sparks.",
  reviews: [],
};

export function getDemoProductBySlug(slug: string): ProductDetail | null {
  return details[slug] ?? null;
}

export { demoCatalog };
