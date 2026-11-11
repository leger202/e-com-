/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#fad2da',
          500: '#e11d48',
          600: '#be123c',
          700: '#9f1239',
          900: '#4c0519',
        }
      }
    },
  },
  plugins: [],
}
