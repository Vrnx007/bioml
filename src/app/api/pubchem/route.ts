import { NextResponse } from "next/server";
import { fetchPubChemByCas } from "@/lib/pubchem";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cas = searchParams.get("cas");
  if (!cas) return NextResponse.json({ error: "missing cas" }, { status: 400 });
  const data = await fetchPubChemByCas(cas);
  if (!data) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(data);
}
