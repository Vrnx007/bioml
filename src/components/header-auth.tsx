"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { LogIn, LogOut, User as UserIcon, Package, Shield, UserCircle } from "lucide-react";

export function HeaderAuth() {
  const t = useTranslations("Nav");
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setEmail(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (email === undefined || email === null) {
      setRole(null);
      return;
    }
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    void supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setRole(null);
        return;
      }
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
      setRole(data?.role ?? null);
    });
  }, [email]);

  if (email === undefined) {
    return <span className="inline-flex min-h-10 w-16 animate-pulse rounded-md bg-surface-muted" aria-hidden />;
  }

  if (!email) {
    return (
      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        <LocalizedNavLink href="/vendor/onboarding">
          <Package className="mr-1.5 hidden h-4 w-4 sm:inline" strokeWidth={2} aria-hidden />
          {t("vendor")}
        </LocalizedNavLink>
        <LocalizedNavLink href="/auth/login">
          <LogIn className="mr-1.5 hidden h-4 w-4 sm:inline" strokeWidth={2} aria-hidden />
          {t("login")}
        </LocalizedNavLink>
      </div>
    );
  }

  const showCompanyDetails = role === "buyer_user";

  return (
    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
      <span className="hidden max-w-[10rem] truncate text-xs text-text-muted sm:inline" title={email}>
        <UserIcon className="mr-1 inline h-3.5 w-3.5 align-text-bottom" strokeWidth={2} aria-hidden />
        {email}
      </span>
      {role === "platform_admin" && (
        <LocalizedNavLink href="/admin">
          <Shield className="mr-1.5 hidden h-4 w-4 sm:inline" strokeWidth={2} aria-hidden />
          {t("admin")}
        </LocalizedNavLink>
      )}
      {(role === "vendor_staff" || role === "platform_admin") && (
        <LocalizedNavLink href="/vendor/onboarding">
          <Package className="mr-1.5 hidden h-4 w-4 sm:inline" strokeWidth={2} aria-hidden />
          {t("vendor")}
        </LocalizedNavLink>
      )}
      {showCompanyDetails && (
        <LocalizedNavLink href="/account">
          <UserCircle className="mr-1.5 hidden h-4 w-4 sm:inline" strokeWidth={2} aria-hidden />
          {t("account")}
        </LocalizedNavLink>
      )}
      <LocalizedNavLink href="/auth/sign-out">
        <LogOut className="mr-1.5 hidden h-4 w-4 sm:inline" strokeWidth={2} aria-hidden />
        {t("logout")}
      </LocalizedNavLink>
    </div>
  );
}

function LocalizedNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-brand-navy"
    >
      {children}
    </Link>
  );
}
