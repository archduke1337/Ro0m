import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  safelist: ['destructive'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // SwiftUI-inspired palette using CSS variables for theme support
      colors: {
        // Primary backgrounds
        bg: {
          primary: 'rgb(var(--bg-primary) / <alpha-value>)',
          secondary: 'rgb(var(--bg-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--bg-tertiary) / <alpha-value>)',
          elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
          card: 'rgb(var(--bg-elevated) / <alpha-value>)',
        },
        // Foreground/text colors
        fg: {
          primary: 'rgb(var(--fg-primary) / <alpha-value>)',
          secondary: 'rgb(var(--fg-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--fg-tertiary) / <alpha-value>)',
          muted: 'rgb(var(--fg-muted) / <alpha-value>)',
        },
        // Accent colors (minimal use)
        accent: {
          DEFAULT: 'rgb(var(--fg-primary) / <alpha-value>)',
          muted: 'rgb(var(--accent-muted))',
          hover: 'rgb(var(--accent-hover))',
        },
        // Borders and separators
        border: {
          DEFAULT: 'rgb(var(--border-default))',
          subtle: 'rgb(var(--border-subtle))',
          strong: 'rgb(var(--border-strong))',
        },
        // System colors for status (these stay constant)
        system: {
          success: '#30D158',
          warning: '#FFD60A',
          error: '#FF453A',
          info: '#64D2FF',
        },
        // Legacy colors (kept for compatibility)
        dark: {
          1: '#1C1C1E',
          2: '#0A0A0A',
          3: '#2C2C2E',
          4: '#3A3A3C',
        },
        blue: {
          1: 'rgb(var(--fg-primary) / <alpha-value>)',
        },
        sky: {
          1: 'rgb(var(--fg-secondary) / <alpha-value>)',
          2: '#E5E5EA',
          3: '#F2F2F7',
        },
      },
      // Typography
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'title': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }],
        'micro': ['0.75rem', { lineHeight: '1.3', fontWeight: '500' }],
      },
      // Refined border radius (SwiftUI uses 10-16px typically)
      borderRadius: {
        'swift': '12px',
        'swift-lg': '16px',
        'swift-xl': '20px',
        'swift-2xl': '24px',
      },
      // Smooth animations
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
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          from: { opacity: '1', transform: 'translateY(0)' },
          to: { opacity: '0', transform: 'translateY(8px)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'subtle-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-out': 'fade-out 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'subtle-pulse': 'subtle-pulse 2s ease-in-out infinite',
      },
      // Box shadows (subtle, Apple-style)
      boxShadow: {
        'swift': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'swift-lg': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'swift-xl': '0 16px 48px rgba(0, 0, 0, 0.5)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      // Backdrop blur for glassmorphism
      backdropBlur: {
        'swift': '20px',
        'swift-lg': '40px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
