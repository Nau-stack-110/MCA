/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}", // Si vous avez un dossier src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};