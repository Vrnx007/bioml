"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";

export function SiteHeader() {
  const t = useTranslations("Nav");
  const c = useTranslations("Common");
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sky-800">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-800">
            BM
          </span>
          <span>{c("brand")}</span>
        </Link>
        <form action={`/${locale}/catalog`} className="order-last flex w-full flex-1 basis-full sm:order-none sm:basis-[320px] md:max-w-xl">
          <input
            name="q"
            placeholder={c("searchPlaceholder")}
            className="w-full rounded-l-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-sky-500 focus:ring-2"
          />
          <button
            type="submit"
            className="rounded-r-md bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800"
          >
            Search
          </button>
        </form>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/catalog" className="text-slate-700 hover:text-sky-800">
            {t("catalog")}
          </Link>
          <Link href="/account" className="text-slate-700 hover:text-sky-800">
            {t("account")}
          </Link>
          <Link href="/vendor/onboarding" className="text-slate-700 hover:text-sky-800">
            {t("vendor")}
          </Link>
          <Link href="/admin" className="text-slate-700 hover:text-sky-800">
            {t("admin")}
          </Link>
          <LocaleSwitcher />
        </nav>
      </div>
      <div className="border-t border-slate-100 bg-slate-50 px-4 py-1.5 text-center text-xs text-slate-600 sm:text-left">
        {c("trustStrip")}
      </div>
    </header>
  );
}
