import { NextResponse } from "next/server";
import Papa from "papaparse";

const required = [
  "Product_Name",
  "CAS_Number",
  "IUPAC_Name",
  "Formula",
  "Purity_Grade",
  "Description",
  "Diagram_URL",
  "CoA_URL",
  "MSDS_URL",
  "Price_per_KG",
  "MOQ_KG",
  "Packaging_Options",
  "Shelf_Life",
  "Supplier_ID",
] as const;

export async function POST(request: Request) {
  const text = await request.text();
  if (!text.trim()) return NextResponse.json({ error: "empty body" }, { status: 400 });

  const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
  if (parsed.errors.length) {
    return NextResponse.json({ errors: parsed.errors.map((e) => e.message) }, { status: 400 });
  }

  const headers = parsed.meta.fields ?? [];
  const missing = required.filter((h) => !headers.includes(h));
  if (missing.length) {
    return NextResponse.json({ error: "missing columns", missing }, { status: 422 });
  }

  const rows = parsed.data.map((row, i) => ({
    row: i + 2,
    product_name: row.Product_Name,
    cas: row.CAS_Number,
    price_per_kg: Number(row.Price_per_KG),
    moq_kg: Number(row.MOQ_KG),
    hsn_suggestion: "derive from tariff in app layer",
  }));

  return NextResponse.json({
    ok: true,
    rowCount: rows.length,
    preview: rows.slice(0, 5),
    note: "Wire to service role or vendor JWT + insert into products / variants / price_tiers.",
  });
}
