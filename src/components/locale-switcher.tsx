"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Languages, ChevronDown } from "lucide-react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="relative flex items-center gap-2">
      <Languages className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden />
      <label className="sr-only" htmlFor="locale-select">
        Language
      </label>
      <select
        id="locale-select"
        className="ui-input min-h-10 cursor-pointer appearance-none py-2 pl-10 pr-10 text-sm font-medium"
        value={locale}
        onChange={(e) => router.replace(pathname, { locale: e.target.value as (typeof routing.locales)[number] })}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {l === "en" ? "English" : "हिन्दी"}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden />
    </div>
  );
}
