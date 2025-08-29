/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
    screens: {
      xs: "400px", // custom breakpoint
      ...defaultTheme.screens, // ubaci Tailwind default breakpoints
    },
  },
  plugins: [],
};
