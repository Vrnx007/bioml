import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CategoryCarousel } from "@/components/category-carousel";

export default async function HomePage() {
  const t = await getTranslations("Home");
  const c = await getTranslations("Common");

  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-br from-sky-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:flex lg:items-center lg:gap-12 lg:py-20">
          <div className="max-w-xl flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{t("heroTitle")}</h1>
            <p className="mt-4 text-lg text-slate-600">{t("heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="rounded-full bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-sky-800"
              >
                {c("brand")} — {c("tagline").split("·")[0]}
              </Link>
              <Link href="/vendor/onboarding" className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:border-sky-400">
                Become a vendor
              </Link>
            </div>
          </div>
          <div className="mt-10 hidden flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg lg:block">
            <p className="text-sm font-semibold text-sky-900">{t("credibilityTitle")}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t("credibilityBody")}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-center text-xs">
              <div className="rounded-lg bg-slate-50 p-3 font-medium text-slate-800">ISO / IEC 17025</div>
              <div className="rounded-lg bg-slate-50 p-3 font-medium text-slate-800">ISO 17034</div>
            </div>
          </div>
        </div>
      </section>
      <CategoryCarousel />
    </div>
  );
}
