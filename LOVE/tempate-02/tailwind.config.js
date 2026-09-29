/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        love: {
          50: '#FFF7F8',
          100: '#FDEBF0',
          200: '#F9D2DE',
          300: '#F4A9BF',
          400: '#EB759B',
          500: '#DE4778',
          600: '#C72A5E',
          700: '#A31C47',
          800: '#871B3F',
          900: '#721B3A',
        },
        cream: {
          50: '#FFFDF9',
          100: '#FAF5EE',
          200: '#F3E8DA',
          300: '#EAD8C3',
          400: '#DEC4A6',
        },
        gold: {
          100: '#FDF6E2',
          200: '#F9EA78',
          300: '#F3D458',
          400: '#E5C138',
          500: '#D4AF37',
          600: '#B89020',
          700: '#8C6912',
        },
        burgundy: {
          DEFAULT: '#6B1D2F',
          dark: '#4A121F',
          light: '#8C2B42',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        handwriting: ['Dancing Script', 'Sacramento', 'cursive'],
        cinzel: ['Cinzel', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(222, 71, 120, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(222, 71, 120, 0.15)',
        'paper': '0 10px 30px -5px rgba(107, 29, 47, 0.1), 0 4px 12px -2px rgba(107, 29, 47, 0.05)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.35)',
        'pink-glow': '0 0 30px rgba(222, 71, 120, 0.25)',
      },
      backgroundImage: {
        'luxury-radial': 'radial-gradient(circle at 50% 50%, #E87A90 0%, #F5B0C2 12%, #FDEBF0 45%, #FFFFFF 80%, #FFFFFF 100%)',
        'gold-gradient': 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
