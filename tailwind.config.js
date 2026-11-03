/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0B0F17',
          900: '#10151F', // Primary dark
          800: '#182231', // Secondary dark
          700: '#233044',
          600: '#33445C',
          500: '#4D6280',
        },
        lime: {
          DEFAULT: '#C6F36B', // Primary electric lime
          light: '#D6F78F',
          dark: '#A6D944',
        },
        cyan: {
          DEFAULT: '#54D7E8', // Secondary accent cyan
          light: '#7FE1EE',
          dark: '#30BACD',
        },
        surface: {
          light: '#F5F7FA',
          card: '#FFFFFF',
          border: '#E2E8F0',
          darkBorder: '#2A374A',
        },
        brand: {
          text: '#182230',
          muted: '#748091',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-lime': '0 0 25px -5px rgba(198, 243, 107, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(84, 215, 232, 0.3)',
        'card-subtle': '0 4px 20px -2px rgba(16, 21, 31, 0.05)',
        'card-elevated': '0 12px 32px -4px rgba(16, 21, 31, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
