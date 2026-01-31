/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sage': {
          DEFAULT: '#A3D9A5',
          300: '#A3D9A5', // Light green background
          400: '#88C48B', // Main matcha green
          500: '#74B96E', // Deeper green
        },
        'forest': {
          DEFAULT: '#1B3C24', // Dark green text/outlines
        },
        'accent': {
          yellow: '#FFD166', // The soda can
          orange: '#FF8A5B', // The 'P' pill
        },
        'black': '#121212', // Buttons
      },
      fontFamily: {
        'sans': ['"Outfit"', 'sans-serif'], // Headings
        'body': ['"Inter"', 'sans-serif'],   // Body text
      }
    },
  },
  plugins: [],
}