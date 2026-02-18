import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#6366f1", light: "#818cf8", dark: "#4f46e5" },
        accent: { DEFAULT: "#f59e0b", light: "#fbbf24" },
      },
    },
  },
  plugins: [],
};
export default config;
