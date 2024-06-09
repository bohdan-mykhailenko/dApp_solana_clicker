import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export const config: Config = {
  content: ["../../packages/ui/src/components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [daisyui],
};
