/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#8B5CF6',
          DEFAULT: '#7C3AED',
          dark: '#5B21B6',
        },
        secondary: {
          light: '#FCD34D',
          DEFAULT: '#F59E0B',
          dark: '#D97706',
        },
        accent: {
          light: '#A78BFA',
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
        },
        background: {
          light: '#F9FAFB',
          DEFAULT: '#F3F4F6',
          dark: '#E5E7EB',
        },
        text: {
          light: '#6B7280',
          DEFAULT: '#374151',
          dark: '#1F2937',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
} 