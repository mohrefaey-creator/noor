import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        arabic: ["var(--font-amiri)", "Scheherazade New", "serif"],
        display: ["var(--font-cormorant)", "serif"],
      },
      colors: {
        // Light-theme palette. Dark theme is applied via direct overrides in globals.css
        // under `:root.dark` so the swap works without depending on Tailwind's CSS-variable
        // resolution behavior (which was inlining var() at build time).
        ink: {
          50: "#0a0907",
          100: "#13120e",
          200: "#1f1d18",
          300: "#34322a",
          400: "#4d4a3e",
          500: "#6b6757",
          600: "#8e8a76",
          700: "#b8b4a0",
          800: "#d6d3c4",
          900: "#ecebe4",
          950: "#f7f6f2",
        },
        gold: {
          400: "#fb923c",
          500: "#ea580c",
          600: "#c2410c",
        },
        emerald: {
          DEFAULT: "#047857",
          glow: "#10b981",
        },
      },
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.45'/></svg>\")",
        "radial-glow": "radial-gradient(circle at 50% 0%, rgba(234,88,12,0.20), transparent 60%)",
        "aurora": "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(4,120,87,0.22), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 30%, rgba(234,88,12,0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 10% 70%, rgba(194,65,12,0.10), transparent 60%)",
      },
      animation: {
        "shimmer": "shimmer 3s linear infinite",
        "pulse-slow": "pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.6s ease-out",
        "reveal": "reveal 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        fadeIn: { "0%": { opacity: "0", transform: "translateY(6px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        reveal: {
          "0%": { opacity: "0", filter: "blur(10px)", transform: "scale(0.92)" },
          "100%": { opacity: "1", filter: "blur(0)", transform: "scale(1)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
