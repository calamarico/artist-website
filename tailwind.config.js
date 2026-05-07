/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#050507",
          900: "#0a0a0c",
          800: "#111114",
          700: "#1a1a1f",
          600: "#26262d",
          500: "#3a3a44",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          soft: "rgb(var(--color-accent-soft) / <alpha-value>)",
          glow: "rgb(var(--color-accent-glow) / <alpha-value>)",
        },
        "accent-fire": {
          DEFAULT: "rgb(var(--color-accent-fire) / <alpha-value>)",
          glow: "rgb(var(--color-accent-fire-glow) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Space Grotesk",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.7" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "wordmark-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "ticker-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        "accent-ping": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgb(var(--color-accent) / 0.18)" },
          "50%": { boxShadow: "0 0 0 8px rgb(var(--color-accent) / 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        "pulse-glow": "pulse-glow 6s ease-in-out infinite",
        "gradient-shift": "gradient-shift 12s ease infinite",
        "wordmark-shift": "wordmark-shift 14s ease-in-out infinite",
        "ticker-scroll": "ticker-scroll 60s linear infinite",
        "blink": "blink 2.4s ease-in-out infinite",
        "accent-ping": "accent-ping 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
