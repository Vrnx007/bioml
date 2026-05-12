"use client";

import { useState } from "react";

export function GstinForm() {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <input
        name="gstin"
        maxLength={15}
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        className="w-full max-w-md rounded border border-slate-200 px-3 py-2 font-mono text-sm uppercase tracking-wide"
        placeholder="22AAAAA0000A1Z5"
        pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
      />
      <button type="submit" className="rounded bg-sky-700 px-4 py-2 text-sm font-medium text-white hover:bg-sky-800">
        Save GSTIN (client demo)
      </button>
      {saved && <p className="text-xs text-emerald-700">Saved locally — persist to organizations.gstin via API + RLS.</p>}
    </form>
  );
}
