import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          page: "var(--surface-page)",
          elevated: "var(--surface-elevated)",
          muted: "var(--surface-muted)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        brand: {
          navy: "var(--brand-navy)",
          "navy-mid": "var(--brand-navy-mid)",
        },
        accent: {
          teal: "var(--accent-teal)",
          "teal-hover": "var(--accent-teal-hover)",
          subtle: "var(--accent-teal-subtle)",
        },
        link: {
          DEFAULT: "var(--link)",
          hover: "var(--link-hover)",
        },
        success: {
          DEFAULT: "var(--success)",
          surface: "var(--success-surface)",
        },
        warning: {
          surface: "var(--warning-surface)",
          border: "var(--warning-border)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-sm": ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        lead: ["1.125rem", { lineHeight: "1.55" }],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        header: "var(--shadow-header)",
        sm: "var(--shadow-sm)",
      },
      borderRadius: {
        ui: "var(--radius-md)",
        card: "var(--radius-lg)",
      },
      maxWidth: {
        measure: "65ch",
      },
    },
  },
  plugins: [],
} satisfies Config;
