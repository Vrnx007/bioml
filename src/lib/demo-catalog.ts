import type { CatalogProduct, ProductDetail } from "@/lib/types";

const demoVendorId = "00000000-0000-0000-0000-00000000d001";

export const DEMO_VENDOR_ORG_ID = demoVendorId;

export const demoCatalog: CatalogProduct[] = [
  {
    id: "p1",
    slug: "benzalkonium-chloride-mm0224",
    title: "Benzalkonium Chloride",
    brand: "Mikromol",
    cas_primary: "8001-54-5",
    catalog_code: "MM0224.00",
    description:
      "Quaternary ammonium antimicrobial used as excipient and API intermediate. Suitable for pharmaceutical formulation with documented impurity profiles and chromatography-grade characterization.",
    product_type: "API, Excipient, Impurity",
    api_family: "Benzalkonium Chloride",
    product_format: "Neat",
    promotion: false,
    fulfillment_city: "Hyderabad",
    fulfillment_state: "Telangana",
    moq_display: "500 mg pack · bulk on RFQ",
    price_per_kg: null,
    min_order_kg: 0.0005,
    image_url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/8753/PNG?record_type=2d&image_size=400x400",
    purity_grade: "Ph. Eur.",
  },
  {
    id: "p2",
    slug: "sodium-hydroxide-elrasa-csf",
    title: "ELRASA-CSF Caustic Soda Flakes",
    brand: "ELRASA",
    cas_primary: "1310-73-2",
    catalog_code: "ELR-CSF-25",
    description:
      "Industrial and pharmaceutical-grade sodium hydroxide flakes. High purity for chromatography media preparation and API process chemistry with consistent particle size.",
    product_type: "Industrial alkali",
    api_family: "Sodium hydroxide",
    product_format: "Flakes",
    promotion: true,
    fulfillment_city: "Mumbai",
    fulfillment_state: "Maharashtra",
    moq_display: "1000 kg MOQ",
    price_per_kg: 50,
    min_order_kg: 1000,
    image_url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/14798/PNG?record_type=2d&image_size=400x400",
    purity_grade: "98%",
  },
  {
    id: "p3",
    slug: "acetonitrile-hplc",
    title: "Acetonitrile HPLC Grade",
    brand: "ChromLab",
    cas_primary: "75-05-8",
    catalog_code: "CH3CN-HPLC-4L",
    description:
      "Ultra-low UV absorbance acetonitrile for LC-MS and HPLC. Filtered through 0.2 µm, packed under nitrogen. Batch CoA includes gradient baseline and evaporation residue.",
    product_type: "Chromatography solvent",
    api_family: "Solvents",
    product_format: "Liquid",
    promotion: false,
    fulfillment_city: "Hyderabad",
    fulfillment_state: "Telangana",
    moq_display: "4 L bottle",
    price_per_kg: null,
    min_order_kg: 4,
    image_url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/6344/PNG?record_type=2d&image_size=400x400",
    purity_grade: "HPLC",
  },
];

const details: Record<string, ProductDetail> = {
  "benzalkonium-chloride-mm0224": {
    ...demoCatalog[0],
    iupac_name: "benzyl-dodecyl-dimethylazanium; chloride",
    formula: "C21H42NO·Cl (representative chain length)",
    pubchem_cid: "8753",
    specs: {
      purity: "≥ 95% (typical)",
      grade: "Ph. Eur. / analytical",
      appearance: "White to off-white powder",
      density: "—",
      ph: "6–8 (1% aq.)",
      boiling_point: "—",
      melting_point: "58–63 °C",
      solubility: "Soluble in water, ethanol",
      storage_temp: "+5 °C",
      shipping_temp: "Room temperature",
      country_of_origin: "Germany",
      tariff_code: "34021200",
    },
    coa_url: "#demo-coa",
    sds_url: "#demo-sds",
    ghs_codes: ["GHS07"],
    hazards: "Causes skin irritation. Causes serious eye damage. Harmful if swallowed.",
    storage: "Store in a cool, dry place. Keep container tightly closed.",
    reviews: [
      { rating: 5, body: "CoA matched our UPLC run; fast dispatch from Hyderabad hub.", author: "QC Lead, generic mfg." },
    ],
    variants: [
      {
        id: "v1",
        sku_code: "MM0224-500MG",
        pack_label: "500 mg",
        unit: "mg",
        pack_size: 500,
        shelf_life: "24 months",
        hsn_code: "34021200",
        in_stock: true,
        tiers: [{ min_qty: 1, unit_price: 0, currency: "INR" }],
      },
    ],
  },
  "sodium-hydroxide-elrasa-csf": {
    ...demoCatalog[1],
    iupac_name: "Sodium hydroxide",
    formula: "NaOH",
    pubchem_cid: "14798",
    specs: {
      purity: "≥ 98%",
      grade: "Industrial / AR",
      appearance: "White flakes",
      density: "2.13 g/cm³",
      ph: "> 12 (1% aq.)",
      boiling_point: "1388 °C",
      melting_point: "318 °C",
      solubility: "Highly soluble in water",
      storage_temp: "Dry ambient",
      shipping_temp: "Ambient",
      country_of_origin: "India",
      tariff_code: "28151100",
    },
    coa_url: "#demo-coa",
    sds_url: "#demo-sds",
    ghs_codes: ["GHS05", "GHS07"],
    hazards: "Corrosive to metals and tissue. Wear PPE.",
    storage: "Store in dry ventilated area. Keep away from acids.",
    reviews: [{ rating: 4, body: "Consistent flakes; drums sealed well.", author: "Plant buyer" }],
    variants: [
      {
        id: "v2",
        sku_code: "ELR-25KG",
        pack_label: "25 kg drum",
        unit: "kg",
        pack_size: 25,
        shelf_life: "24 months",
        hsn_code: "28151100",
        in_stock: true,
        tiers: [
          { min_qty: 1000, unit_price: 50, currency: "INR" },
          { min_qty: 5000, unit_price: 46, currency: "INR" },
        ],
      },
    ],
  },
  "acetonitrile-hplc": {
    ...demoCatalog[2],
    iupac_name: "Acetonitrile",
    formula: "CH3CN",
    pubchem_cid: "6344",
    specs: {
      purity: "≥ 99.9%",
      grade: "HPLC / LC-MS",
      appearance: "Clear liquid",
      density: "0.79 g/mL",
      ph: "Neutral",
      boiling_point: "82 °C",
      melting_point: "−45 °C",
      solubility: "Miscible with water",
      storage_temp: "15–25 °C",
      shipping_temp: "Ambient (DG as per MSDS)",
      country_of_origin: "India",
      tariff_code: "29269099",
    },
    coa_url: "#demo-coa",
    sds_url: "#demo-sds",
    ghs_codes: ["GHS02", "GHS07"],
    hazards: "Highly flammable liquid and vapour.",
    storage: "Keep away from heat/sparks. Ground containers when dispensing.",
    reviews: [],
    variants: [
      {
        id: "v3",
        sku_code: "CH3CN-4L",
        pack_label: "4 L glass bottle",
        unit: "L",
        pack_size: 4,
        shelf_life: "36 months unopened",
        hsn_code: "29269099",
        in_stock: true,
        tiers: [{ min_qty: 4, unit_price: 890, currency: "INR" }],
      },
    ],
  },
};

export function getDemoCatalog(filters?: Record<string, string | undefined>): CatalogProduct[] {
  let list = [...demoCatalog];
  if (filters?.brand) list = list.filter((p) => (p.brand || "").toLowerCase().includes(filters.brand!.toLowerCase()));
  if (filters?.cas) list = list.filter((p) => (p.cas_primary || "").includes(filters.cas!));
  if (filters?.apiFamily) list = list.filter((p) => (p.api_family || "").toLowerCase().includes(filters.apiFamily!.toLowerCase()));
  if (filters?.productType)
    list = list.filter((p) => (p.product_type || "").toLowerCase().includes(filters.productType!.toLowerCase()));
  if (filters?.format) list = list.filter((p) => (p.product_format || "").toLowerCase() === filters.format!.toLowerCase());
  if (filters?.state) list = list.filter((p) => (p.fulfillment_state || "").toLowerCase() === filters.state!.toLowerCase());
  if (filters?.promotion === "1") list = list.filter((p) => p.promotion);
  return list;
}

export function getDemoProductBySlug(slug: string): ProductDetail | null {
  return details[slug] ?? null;
}
