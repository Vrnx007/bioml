"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className="flex items-center gap-1 text-xs text-slate-600">
      <span className="sr-only">Language</span>
      <select
        className="rounded border border-slate-200 bg-white px-2 py-1 text-slate-800"
        value={locale}
        onChange={(e) => router.replace(pathname, { locale: e.target.value as (typeof routing.locales)[number] })}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {l === "en" ? "English" : "हिन्दी"}
          </option>
        ))}
      </select>
    </label>
  );
}
