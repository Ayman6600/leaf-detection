import { defineConfig } from '@tailwindcss/postcss';

export default defineConfig({
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito Sans', 'system-ui', 'sans-serif'],
        display: ['Nunito Sans', 'sans-serif'],
        body: ['Nunito Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        'nature-green': {
          dark: '#1B5E20',
          medium: '#66BB6A',
          light: '#C8E6C9',
        },
        'neutral': {
          bg: '#F5F7FA',
        },
        'dark-green': {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#66BB6A', // Updated to Medium Green
          600: '#1B5E20', // Updated to Dark Green
          700: '#15803d',
          800: '#065f46',
          900: '#064e3b',
          950: '#0a3d2a',
        },
        'teal': {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
        'mint': {
          300: '#C8E6C9', // Updated to Light Green
          400: '#2dd4bf',
        },
      },
      boxShadow: {
        'leaf': '0 4px 14px 0 rgba(27, 94, 32, 0.28)',
        'leaf-lg': '0 10px 30px 0 rgba(27, 94, 32, 0.35)',
        'glow': '0 0 20px rgba(27, 94, 32, 0.5)',
        'glow-lg': '0 0 40px rgba(27, 94, 32, 0.65)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        shimmer: {
          "0%": {
            backgroundPosition: "-1000px 0",
          },
          "100%": {
            backgroundPosition: "1000px 0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
});
