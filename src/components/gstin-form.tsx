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
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="gstin" className="ui-label">
          GSTIN
        </label>
        <input
          id="gstin"
          name="gstin"
          maxLength={15}
          value={value}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          className="ui-input max-w-md font-mono uppercase tracking-wide"
          placeholder="22AAAAA0000A1Z5"
          pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}"
          autoComplete="off"
        />
      </div>
      <button type="submit" className="ui-btn-primary">
        Save GSTIN (demo)
      </button>
      {saved && (
        <p className="text-sm font-medium text-success" role="status">
          Saved locally — persist to <span className="font-mono">organizations.gstin</span> via your API.
        </p>
      )}
    </form>
  );
}
