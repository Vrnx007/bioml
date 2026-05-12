"use client";

import { useLocale, useTranslations } from "next-intl";
import { Search, User, Package, Shield } from "lucide-react";
import { Link as LocalizedLink } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function SiteHeader() {
  const t = useTranslations("Nav");
  const c = useTranslations("Common");
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-elevated/95 shadow-header backdrop-blur-md">
      <div className="ui-container flex flex-wrap items-center gap-4 py-3 lg:flex-nowrap lg:gap-6">
        <LocalizedLink href="/" className="group flex shrink-0 items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-card border border-border bg-brand-navy text-sm font-bold tracking-wide text-white shadow-sm transition group-hover:border-accent-teal"
            aria-hidden
          >
            BM
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-brand-navy group-hover:text-accent-teal">
            {c("brand")}
          </span>
        </LocalizedLink>

        <form
          action={`/${locale}/catalog`}
          className="order-3 flex w-full flex-1 basis-full lg:order-none lg:max-w-2xl lg:basis-auto"
          role="search"
        >
          <label className="sr-only" htmlFor="global-search">
            {c("searchPlaceholder")}
          </label>
          <div className="flex w-full overflow-hidden rounded-ui border border-border-strong bg-surface-muted shadow-sm transition focus-within:border-accent-teal focus-within:ring-2 focus-within:ring-accent-teal/20">
            <input
              id="global-search"
              name="q"
              placeholder={c("searchPlaceholder")}
              className="min-h-11 flex-1 border-0 bg-transparent px-4 text-base text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="flex min-h-11 min-w-11 shrink-0 items-center justify-center bg-brand-navy px-4 text-white transition hover:bg-brand-navy-mid"
              aria-label="Search catalog"
            >
              <Search className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </form>

        <nav
          className="ml-auto flex flex-wrap items-center justify-end gap-1 sm:gap-2"
          aria-label="Primary"
        >
          <NavItem href="/catalog">{t("catalog")}</NavItem>
          <NavItem href="/account">
            <User className="mr-1.5 hidden h-4 w-4 sm:inline" strokeWidth={2} aria-hidden />
            {t("account")}
          </NavItem>
          <NavItem href="/vendor/onboarding">
            <Package className="mr-1.5 hidden h-4 w-4 sm:inline" strokeWidth={2} aria-hidden />
            {t("vendor")}
          </NavItem>
          <NavItem href="/admin">
            <Shield className="mr-1.5 hidden h-4 w-4 sm:inline" strokeWidth={2} aria-hidden />
            {t("admin")}
          </NavItem>
          <div className="ml-1 flex items-center border-l border-border pl-3">
            <LocaleSwitcher />
          </div>
        </nav>
      </div>

      <div className="ui-trust-strip">
        <div className="ui-container py-2.5 text-center sm:text-left">{c("trustStrip")}</div>
      </div>
    </header>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <LocalizedLink
      href={href}
      className="inline-flex min-h-10 items-center rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-brand-navy"
    >
      {children}
    </LocalizedLink>
  );
}
