import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function AdminHomePage() {
  const t = await getTranslations("Admin");
  const links = [
    { href: "/admin/sellers", label: t("sellers") },
    { href: "/admin/products", label: t("products") },
    { href: "/admin/taxonomy", label: t("taxonomy") },
    { href: "/admin/reviews", label: t("reviews") },
  ] as const;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
      <ul className="mt-8 space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="block rounded-lg border border-slate-200 bg-white px-4 py-3 font-medium text-sky-900 shadow-sm hover:border-sky-400">
              {l.label} →
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-slate-600">{t("featureFlags")}: configure via env / DB in production.</p>
    </div>
  );
}
