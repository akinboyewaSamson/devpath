import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EE5902',
          hover: '#D44E02',
          light: '#FF7A29',
          dark: '#C44600',
          50: '#FFF7F2',
          100: '#FFEFE6',
          200: '#FEBF9A',
          600: '#EE5902',
        },
        orbit: {
          bg: '#FDFBFA',
          card: '#FFFFFF',
          navy: '#0D0D54',
          slate: '#1B1B38',
          charcoal: '#333333',
          border: '#E2E8F0',
          borderLight: '#F1F5F9',
          tealBg: '#EFF6F6',
          tealBorder: '#BEDADA',
          tealText: '#376262',
          purpleBg: '#F8ECF8',
          purpleBorder: '#E4B4E2',
          purpleText: '#70296E',
          orangeBg: '#FFEFE6',
          orangeBorder: '#FEBF9A',
          orangeText: '#EE5902',
        },
        surfaceLight: '#FDFBFA',
        cardLight: '#FFFFFF',
        textLight: '#1B1B38',
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['DM Sans', 'Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s infinite ease-in-out',
        'fade-in': 'fade-in 0.25s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
