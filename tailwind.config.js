/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#01411C',
          dark: '#002510',
          light: '#03662d',
          subtle: 'rgba(1, 65, 28, 0.08)',
        },
        gold: {
          DEFAULT: '#D79A00',
          light: '#fff3d6',
          dark: '#b07e00',
        },
        leaf: {
          DEFAULT: '#8CCB52',
          subtle: 'rgba(140, 203, 82, 0.15)',
        },
        charcoal: '#222222',
        muted: '#666666',
        surface: '#F8F9FA',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 25px -5px rgba(1, 65, 28, 0.08)',
        glow: '0 0 20px rgba(215, 154, 0, 0.25)',
      }
    },
  },
  plugins: [],
}
