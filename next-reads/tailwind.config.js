/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      // Default Tailwind breakpoints, prilagođeni za desktop/mobile
      sm: "640px", // small devices (mobile)
      md: "768px", // medium devices (tablet / laptop)
      lg: "1024px", // large devices (desktop)
      xl: "1280px", // extra large (larger desktop)
      "2xl": "1536px", // ultra wide screens
    },
  },
  plugins: [],
};
