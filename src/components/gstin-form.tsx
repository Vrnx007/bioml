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
    <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
      <div>
        <label htmlFor="gstin" className="ui-label">
          GSTIN
        </label>
        <input
          id="gstin"
          name="gstin"
          maxLength={32}
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          className="ui-input max-w-md font-mono uppercase tracking-wide"
          placeholder="Any demo value (e.g. DEMO-GSTIN-1)"
          autoComplete="off"
        />
      </div>
      <button type="submit" className="ui-btn-primary">
        Save (demo)
      </button>
      {saved && (
        <p className="text-sm font-medium text-success" role="status">
          Saved locally for this session. Wire to your API for production.
        </p>
      )}
    </form>
  );
}
