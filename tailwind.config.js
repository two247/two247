/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./*.html",
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
        brand: {
          navy: "#0F172A",      // Primary Neutral Obsidian (Zero blue hue)
          dark: "#09090B",      // Extra deep neutral for overlays & text
          blue: "#18181B",      // Replaced Travel Blue with Luxury Charcoal
          orange: "#F59E0B",    // Accent - Warm Gold/Amber (Primary CTA & 24/7)
          orangeHover: "#D97706",
          bg: "#FFFFFF",        // White is Primary Canvas
          surface: "#FFFFFF",   // Cards & Components
          surfaceMuted: "#F8FAFC", // Soft neutral contrast
          text: "#0F172A",      // Primary Text - High Contrast Charcoal
          muted: "#64748B",     // Secondary Text
          border: "#E2E8F0"
        }
      },
      fontFamily: {
        sans: ['Manrope', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
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
