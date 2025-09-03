/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: "#155449",
        dark: "#0f3a32",
      },
      secondary: {
        DEFAULT: "#B82B24",
        dark: "#8f1f1b",
      },
      neutral: {
        light: "#F2F2F2",
        white: "#FFFFFF",
        DEFAULT: "#8C6954",
        dark: "#593E2E",
      },
      accent: {
        pink: "#F2CAB3",
      },
    },
    screens: {
      xs: "400px",
      ...defaultTheme.screens,
    },
  },
  plugins: [],
};
