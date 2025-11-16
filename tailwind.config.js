/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffffff',
        secondary: '#131313',
        accent: '#F02D6E',
        gray: '#888888',
        lightGray: '#f5f5f5',
        background: '#131313',
      },
      fontFamily: {
        sans: ['Palanquin', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        palanquin: ['Palanquin', 'sans-serif'],
      },
      screens: {
        mobile: '768px',
        tablet: '1024px',
        desktop: '1200px',
      },
    },
  },
  plugins: [],
}
