import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1628',
          50: '#e8edf5',
          100: '#c5d0e4',
          200: '#9fb0d1',
          300: '#7890bd',
          400: '#5a76ae',
          500: '#3c5da0',
          600: '#2d4d8f',
          700: '#1e3a78',
          800: '#132860',
          900: '#0A1628',
        },
        gold: {
          DEFAULT: '#C9A84C',
          50: '#fdf8ed',
          100: '#f9eed0',
          200: '#f3dc9f',
          300: '#ecc769',
          400: '#e6b53f',
          500: '#C9A84C',
          600: '#b08a2c',
          700: '#8e6b22',
          800: '#6e5120',
          900: '#59421e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Arabic', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
