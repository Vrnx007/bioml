import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function SiteFooter() {
  const c = await getTranslations("Common");
  const t = await getTranslations("Nav");

  return (
    <footer className="border-t border-slate-200 bg-white py-10 text-sm text-slate-600">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:justify-between sm:px-6">
        <div>
          <p className="font-semibold text-slate-900">{c("brand")}</p>
          <p className="mt-1 max-w-md">{c("tagline")}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/catalog" className="hover:text-sky-800">
            {t("catalog")}
          </Link>
          <Link href="/vendor/import" className="hover:text-sky-800">
            Vendor CSV import
          </Link>
        </div>
      </div>
    </footer>
  );
}
