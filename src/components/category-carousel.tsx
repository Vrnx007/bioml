import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const categories = [
  { slug: "crm", labelKey: "Certified reference materials" },
  { slug: "filtration", labelKey: "Microbial filtration" },
  { slug: "solvents", labelKey: "Solvents" },
  { slug: "media", labelKey: "Culture media" },
  { slug: "cells", labelKey: "Cell separation media" },
  { slug: "filters", labelKey: "Syringe filters" },
] as const;

export async function CategoryCarousel() {
  const t = await getTranslations("Home");

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-lg font-semibold text-slate-900">{t("shopTopCategories")}</h2>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog?productType=${encodeURIComponent(cat.labelKey)}`}
              className="flex min-w-[140px] flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm hover:border-sky-300"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-xl text-sky-800">
                ◎
              </span>
              <span className="text-xs font-medium text-sky-900">{cat.labelKey}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
