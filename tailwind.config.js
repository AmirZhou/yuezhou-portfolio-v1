/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          base: '#0a0a0a',
          elevated: '#0f0f0f',
          card: 'rgba(25, 25, 28, 0.75)',
        },
      },
    },
  },
  plugins: [],
}
