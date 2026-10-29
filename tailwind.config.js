/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        giftly: {
          bg: "#FFFAFC",
          pink: "#F8DCE8",
          'pink-hover': "#F2C7DA",
          'pink-light': "#FFF4F8",
          lavender: "#E9DFFF",
          'lavender-light': "#F5EFFF",
          'lavender-dark': "#8672D6",
          purple: "#7955E8",
          'purple-hover': "#6842D8",
          'purple-deep': "#4F33A5",
          peach: "#FFE7D8",
          'peach-light': "#FFF2EA",
          'peach-dark': "#E49A70",
          dark: "#282238",
          muted: "#6B637B",
          subtle: "#9F97AF",
          border: "#F0E7ED",
          surface: "#FFFFFF",
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Poppins', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Poppins', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(121, 85, 232, 0.08)',
        'card': '0 14px 34px -10px rgba(40, 34, 56, 0.06), 0 4px 12px -2px rgba(40, 34, 56, 0.03)',
        'hover': '0 20px 40px -12px rgba(121, 85, 232, 0.16), 0 8px 16px -4px rgba(40, 34, 56, 0.04)',
        'glow': '0 0 35px -5px rgba(121, 85, 232, 0.35)',
        'modal': '0 25px 60px -15px rgba(40, 34, 56, 0.25)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(-2deg)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        }
      }
    },
  },
  plugins: [],
}
