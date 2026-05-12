import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { CategoryCarousel } from "@/components/category-carousel";

export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-surface-elevated via-surface-muted to-accent-subtle/30">
        <div className="ui-container py-16 sm:py-20 lg:flex lg:items-center lg:gap-16 lg:py-24">
          <div className="max-w-2xl flex-1">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-teal">B2B procurement</p>
            <h1 className="mt-4 font-display text-display text-brand-navy sm:text-[2.75rem]">{t("heroTitle")}</h1>
            <p className="ui-prose mt-6 max-w-measure text-lg text-text-secondary">{t("heroSubtitle")}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/catalog" className="ui-btn-primary gap-2">
                Browse catalog
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </Link>
              <Link href="/vendor/onboarding" className="ui-btn-secondary">
                Become a verified vendor
              </Link>
            </div>
          </div>
          <aside className="mt-12 w-full max-w-md lg:mt-0 lg:shrink-0">
            <div className="ui-card p-8 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent-teal">{t("credibilityTitle")}</p>
              <p className="mt-4 text-base leading-relaxed text-text-secondary">{t("credibilityBody")}</p>
              <dl className="mt-8 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-ui border border-border bg-surface-muted/80 px-3 py-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Laboratory</dt>
                  <dd className="mt-1 font-display text-lg font-semibold text-brand-navy">17025</dd>
                </div>
                <div className="rounded-ui border border-border bg-surface-muted/80 px-3 py-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Reference</dt>
                  <dd className="mt-1 font-display text-lg font-semibold text-brand-navy">17034</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
      <CategoryCarousel />
    </div>
  );
}
