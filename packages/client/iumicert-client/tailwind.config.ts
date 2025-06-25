import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Primary font (Inter) - for body text, navigation, etc.
        inter: ["var(--font-inter)", "sans-serif"],
        // Display font (Space Grotesk) - for headings and display text
        "space-grotesk": ["var(--font-space-grotesk)", "sans-serif"],
        // Special font (Crimson) - only for IU-MiCert text
        crimson: ["var(--font-crimson)", "serif"],
        // Set Inter as default sans font
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
