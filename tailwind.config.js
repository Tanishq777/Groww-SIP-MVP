/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        groww: {
          green: "#00D09C",
          "green-hover": "#00B386",
          "green-light": "#E6FAF5",
          "green-badge": "#D9F7EE",
          slate: "#44475B",
          dark: "#1E222B",
          muted: "#7C7E8C",
          subtle: "#9EA0AB",
          border: "#EBECEF",
          "border-light": "#F2F3F5",
          bg: "#FFFFFF",
          surface: "#F9FAFB",
          card: "#FFFFFF",
          red: "#EB5B3C",
          "red-light": "#FDF2F0",
          yellow: "#FBBF24"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif"
        ]
      }
    },
  },
  plugins: [],
}

