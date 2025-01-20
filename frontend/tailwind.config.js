/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "custom-light": "0 2px 10px rgba(0, 0, 0, 0.1)", // Light shadow
        "custom-dark": "0 4px 15px rgba(0, 0, 0, 0.25)", // Dark shadow
        "custom-glow": "0 0 15px rgba(0, 123, 255, 0.5)", // Glow effect
      },
      colors: {},
    },
  },
  plugins: [tailwindcssAnimate],
};
