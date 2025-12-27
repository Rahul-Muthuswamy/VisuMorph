/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'purple-dark': '#1a0b2e',
        'purple-mid': '#6b21a8',
        'blue-dark': '#0f172a',
        'blue-mid': '#3b82f6',
      },
      backgroundImage: {
        'gradient-purple-blue': 'linear-gradient(135deg, #6b21a8 0%, #3b82f6 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a0b2e 0%, #0f172a 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}

