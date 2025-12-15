/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        secondary: '#6366f1',
        accent: '#f59e0b',
        dark: '#1f2937',
        light: '#f9fafb',
      },
    },
  },
  plugins: [],
}
