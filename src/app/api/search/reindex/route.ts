import { NextResponse } from "next/server";

/** Stub: enqueue Meilisearch / OpenSearch reindex jobs (see search_index_jobs table). */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { productIds?: string[] };
  const ids = body.productIds ?? [];
  return NextResponse.json({
    jobs: ids.map((id) => ({ productId: id, status: "pending", provider: "meilisearch-stub" })),
  });
}
