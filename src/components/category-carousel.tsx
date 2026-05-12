import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ShieldCheck, Droplets, FlaskConical, Beaker, TestTube2, Syringe } from "lucide-react";

const categories = [
  { slug: "crm", labelKey: "Certified reference materials", Icon: ShieldCheck },
  { slug: "filtration", labelKey: "Microbial filtration", Icon: Droplets },
  { slug: "solvents", labelKey: "Solvents", Icon: FlaskConical },
  { slug: "media", labelKey: "Culture media", Icon: Beaker },
  { slug: "cells", labelKey: "Cell separation media", Icon: TestTube2 },
  { slug: "filters", labelKey: "Syringe filters", Icon: Syringe },
] as const;

export async function CategoryCarousel() {
  const t = await getTranslations("Home");

  return (
    <section className="border-t border-border bg-surface-elevated py-14">
      <div className="ui-container">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-display-sm text-brand-navy">{t("shopTopCategories")}</h2>
          <p className="max-w-measure text-sm text-text-muted">Browse by application — same filters apply on the catalog.</p>
        </div>
        <div className="mt-8 flex gap-4 overflow-x-auto pb-2 pt-1 [scrollbar-width:thin]">
          {categories.map(({ slug, labelKey, Icon }) => (
            <Link
              key={slug}
              href={`/catalog?category=${slug}`}
              className="group flex min-w-[158px] flex-col items-center gap-4 rounded-card border border-border bg-surface-muted/40 p-5 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-accent-teal hover:bg-surface-elevated hover:shadow-card"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface-elevated text-accent-teal shadow-sm transition group-hover:border-accent-teal/40 group-hover:bg-accent-subtle">
                <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="text-sm font-semibold leading-snug text-brand-navy group-hover:text-accent-teal-hover">{labelKey}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
