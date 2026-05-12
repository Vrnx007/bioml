import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";

export default async function AdminHomePage() {
  const t = await getTranslations("Admin");
  const links = [
    { href: "/admin/sellers", label: t("sellers") },
    { href: "/admin/products", label: t("products") },
    { href: "/admin/taxonomy", label: t("taxonomy") },
    { href: "/admin/reviews", label: t("reviews") },
  ] as const;

  return (
    <div className="border-b border-border bg-surface-page py-12 sm:py-16">
      <div className="ui-container max-w-3xl">
        <h1 className="font-display text-display-sm text-brand-navy">{t("title")}</h1>
        <ul className="mt-10 space-y-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group flex min-h-[52px] items-center justify-between rounded-card border border-border bg-surface-elevated px-5 py-4 font-semibold text-brand-navy shadow-sm transition hover:border-accent-teal hover:shadow-card"
              >
                {l.label}
                <ChevronRight className="h-5 w-5 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-accent-teal" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm leading-relaxed text-text-secondary">
          {t("featureFlags")}: configure via env or database in production.
        </p>
      </div>
    </div>
  );
}
