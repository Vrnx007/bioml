import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const supabase = createSupabaseMiddlewareClient(request, response);
  if (!supabase) return response;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const m = pathname.match(/^\/(en|hi)(\/(.*))?$/);
  const locale = m?.[1] ?? "en";
  const rest = (m?.[3] ?? "").replace(/^\//, "");

  if (rest.startsWith("admin")) {
    if (!user) {
      const u = new URL(`/${locale}/auth/login`, request.url);
      u.searchParams.set("next", pathname);
      return NextResponse.redirect(u);
    }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    if (profile?.role !== "platform_admin") {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  if (rest.startsWith("vendor")) {
    if (!user) {
      const u = new URL(`/${locale}/auth/login`, request.url);
      u.searchParams.set("next", pathname);
      return NextResponse.redirect(u);
    }
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
    const allowed = profile?.role === "vendor_staff" || profile?.role === "platform_admin";
    if (!allowed) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
