import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta del prototipo (page.tsx): cyan/emerald/violet/amber sobre slate-950
        brand: { cyan: "#22d3ee", emerald: "#34d399", violet: "#a78bfa", amber: "#fbbf24" },
      },
    },
  },
  plugins: [],
};
export default config;
