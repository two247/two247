/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./*.html",
    "./admin/**/*.{html,js}",
    "./packages/**/*.{html,js}",
    "./destinations/**/*.{html,js}",
    "./blog/**/*.{html,js}",
    "./components/**/*.{html,js}",
    "./js/**/*.{html,js}",
    "./data/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        primary: "#000000",
        secondary: "#6F6F6F",
        brand: {
          navy: "#000000",      // Pure Black (Zero Blue)
          dark: "#000000",      // Deep Obsidian
          blue: "#18181B",      // Editorial Zinc
          orange: "#D4AF37",    // Refined Champagne Gold
          orangeHover: "#B89628",
          bg: "#FFFFFF",        // White is Primary Canvas
          surface: "#FFFFFF",   // Cards & Components
          surfaceMuted: "#FAFAFA", // Clean Pearl Contrast
          text: "#000000",      // Primary Black Text
          muted: "#6F6F6F",     // Editorial Secondary Gray (#6F6F6F)
          border: "#E5E7EB"
        }
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', '"Plus Jakarta Sans"', 'Manrope', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeRise: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-rise': 'fadeRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-rise-delay': 'fadeRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
        'fade-rise-delay-2': 'fadeRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(7, 26, 43, 0.05)',
        'elevated': '0 12px 32px -4px rgba(7, 26, 43, 0.12)',
        'glow-orange': '0 0 25px rgba(245, 158, 11, 0.35)',
      }
    },
  },
  plugins: [],
}
