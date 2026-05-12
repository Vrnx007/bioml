import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const c = await getTranslations("Common");
  const t = await getTranslations("Nav");

  return (
    <footer className="mt-auto border-t border-border bg-brand-navy text-slate-300">
      <div className="ui-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-display text-2xl font-semibold text-white">{c("brand")}</p>
          <p className="mt-3 max-w-md text-base leading-relaxed text-slate-400">{c("tagline")}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Navigate</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/catalog" className="text-slate-300 transition hover:text-white">
                {t("catalog")}
              </Link>
            </li>
            <li>
              <Link href="/account" className="text-slate-300 transition hover:text-white">
                {t("account")}
              </Link>
            </li>
            <li>
              <Link href="/vendor/onboarding" className="text-slate-300 transition hover:text-white">
                {t("vendor")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Suppliers</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/vendor/import" className="text-slate-300 transition hover:text-white">
                CSV catalog import
              </Link>
            </li>
            <li>
              <Link href="/admin" className="text-slate-300 transition hover:text-white">
                {t("admin")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="ui-container flex flex-col gap-2 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {c("brand")}. All rights reserved.</span>
          <span className="text-slate-600">ISO-aligned documentation workflows · India GST-ready data model</span>
        </div>
      </div>
    </footer>
  );
}
