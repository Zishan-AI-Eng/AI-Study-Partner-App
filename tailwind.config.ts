import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        card: "var(--surface)",
        border: "var(--border)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        primary: "var(--primary)",
        "primary-action": "var(--primary-action)",
        "primary-foreground": "var(--orange-button-text)",
        accent: "var(--accent)",
        sidebar: "var(--sidebar)",
        "sidebar-text": "var(--sidebar-text)",
        "active-nav": "var(--active-nav)",
        "active-nav-text": "var(--active-nav-text)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        graphite: "var(--sidebar)",
        orange: "var(--primary)",
        "orange-hover": "var(--orange-hover)",
        "orange-text": "var(--orange-text)",
        "orange-tint": "var(--orange-tint)",
        "orange-button-text": "var(--orange-button-text)",
        page: "var(--background)",
      },
    },
  },
};

export default config;
