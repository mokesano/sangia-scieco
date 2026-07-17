module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue': {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },
        // Palet warna brand, diselaraskan dari desainInterface.html
        brand: {
          DEFAULT: '#ff5627',
          hover: '#e0481d',
          dark: '#0a0d13',
          card: '#161b22',
          muted: '#6b1604',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      backgroundImage: {
        'hero-peach': 'radial-gradient(100% 100% at 50% 0%, #fff2ec 0%, #fffaf7 40%, #ffffff 100%)',
      },
    },
  },
  plugins: [],
}