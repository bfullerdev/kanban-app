/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#1e1e2e',
        surface: '#2a2a3c',
        primary: '#6366f1',
      },
    },
  },
  plugins: [],
}
