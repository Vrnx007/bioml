"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

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
    <aside className="w-full shrink-0 rounded-lg border border-slate-200 bg-white lg:w-64">
      <div className="border-b border-slate-100 px-3 py-2 text-sm font-semibold text-slate-900">{tc("filters")}</div>
      <ul className="max-h-[70vh] divide-y divide-slate-100 overflow-y-auto text-sm">
        {filterKeys.map(([param, msgKey]) => (
          <li key={param} className="px-3 py-2">
            <details className="group">
              <summary className="cursor-pointer list-none font-medium text-slate-800 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between">
                  {t(msgKey)}
                  <span className="text-slate-400 group-open:rotate-45">+</span>
                </span>
              </summary>
              <div className="mt-2 pb-1">
                {param === "promotion" ? (
                  <label className="flex items-center gap-2 text-slate-600">
                    <input
                      type="checkbox"
                      checked={searchParams.get("promotion") === "1"}
                      onChange={(e) => setParam("promotion", e.target.checked ? "1" : "")}
                    />
                    On promotion only
                  </label>
                ) : (
                  <input
                    className="mt-1 w-full rounded border border-slate-200 px-2 py-1 text-xs"
                    placeholder="Filter…"
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
      <div className="border-t border-slate-100 p-2">
        <button
          type="button"
          className="w-full rounded border border-slate-200 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
          onClick={() => router.push(pathname)}
        >
          {tc("clearFilters")}
        </button>
      </div>
    </aside>
  );
}
