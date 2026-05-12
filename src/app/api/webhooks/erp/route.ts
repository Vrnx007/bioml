import { NextResponse } from "next/server";

/** Outbound ERP webhook receiver (seller systems). Log + 200; replace with HMAC verify + queue. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  console.info("[erp-webhook]", JSON.stringify(body).slice(0, 2000));
  return NextResponse.json({ received: true, ts: new Date().toISOString() });
}
