"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";

const filterKeys = [
  ["promotion", "promotion"],
  ["apiFamily", "apiFamily"],
  ["productType", "productType"],
  ["brand", "brand"],
  ["productAccreditations", "productAccreditations"],
  ["labAccreditations", "labAccreditations"],
  ["analyte", "analyte"],
  ["cas", "casNumber"],
  ["format", "productFormat"],
  ["impurityType", "impurityType"],
  ["silType", "silType"],
  ["matrix", "matrix"],
  ["state", "location"],
] as const;

export function FilterSidebar() {
  const t = useTranslations("Filters");
  const tc = useTranslations("Catalog");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const n = new URLSearchParams(searchParams.toString());
      if (!value) n.delete(key);
      else n.set(key, value);
      const q = n.toString();
      router.push(q ? `${pathname}?${q}` : pathname);
    },
    [pathname, router, searchParams]
  );

  return (
    <aside className="ui-card w-full shrink-0 overflow-hidden lg:w-72">
      <div className="border-b border-border bg-surface-muted/50 px-4 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-navy">{tc("filters")}</h2>
      </div>
      <ul className="max-h-[min(70vh,640px)] divide-y divide-border-default overflow-y-auto">
        {filterKeys.map(([param, msgKey]) => (
          <li key={param} className="px-1">
            <details className="group px-3 py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 py-3 text-sm font-medium text-text-primary [&::-webkit-details-marker]:hidden">
                <span>{t(msgKey)}</span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="border-t border-border pb-3 pt-1">
                {param === "promotion" ? (
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-1 py-2 text-sm text-text-secondary">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border-strong text-accent-teal focus:ring-accent-teal"
                      checked={searchParams.get("promotion") === "1"}
                      onChange={(e) => setParam("promotion", e.target.checked ? "1" : "")}
                    />
                    On promotion only
                  </label>
                ) : (
                  <input
                    className="ui-input mt-1 text-sm"
                    placeholder="Type and press Enter"
                    defaultValue={searchParams.get(param) ?? ""}
                    onBlur={(e) => setParam(param, e.target.value.trim())}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setParam(param, (e.target as HTMLInputElement).value.trim());
                    }}
                  />
                )}
              </div>
            </details>
          </li>
        ))}
      </ul>
      <div className="border-t border-border bg-surface-muted/30 p-3">
        <button
          type="button"
          className="ui-btn-secondary w-full border-dashed py-2.5 text-sm font-medium"
          onClick={() => router.push(pathname)}
        >
          {tc("clearFilters")}
        </button>
      </div>
    </aside>
  );
}
