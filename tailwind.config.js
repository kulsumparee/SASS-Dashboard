/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand — reads CSS vars so the accent-color picker can swap it live
        primary: {
          50:  'rgb(var(--c-primary-50) / <alpha-value>)',
          100: 'rgb(var(--c-primary-100) / <alpha-value>)',
          200: 'rgb(var(--c-primary-200) / <alpha-value>)',
          300: 'rgb(var(--c-primary-300) / <alpha-value>)',
          400: 'rgb(var(--c-primary-400) / <alpha-value>)',
          500: 'rgb(var(--c-primary-500) / <alpha-value>)',
          600: 'rgb(var(--c-primary-600) / <alpha-value>)',
          700: 'rgb(var(--c-primary-700) / <alpha-value>)',
          800: 'rgb(var(--c-primary-800) / <alpha-value>)',
          900: 'rgb(var(--c-primary-900) / <alpha-value>)',
        },
        accent: {
          400: 'rgb(var(--c-primary-300) / <alpha-value>)',
          500: 'rgb(var(--c-primary-400) / <alpha-value>)',
          600: 'rgb(var(--c-primary-600) / <alpha-value>)',
        },
        // Dark theme surfaces
        dark: {
          50:  '#f8f8ff',
          100: '#e8e8f0',
          200: '#c8c8d8',
          300: '#9898b0',
          400: '#6868808',
          500: '#484860',
          600: '#2e2e48',
          700: '#1e1e32',
          800: '#16162a',
          900: '#0f0f1a',
          950: '#080810',
        },
        surface: {
          DEFAULT: '#1a1a2e',
          hover:   '#1f1f38',
          active:  '#242440',
          border:  'rgba(255,255,255,0.06)',
        },
        // Semantic
        success: { 400: '#34d399', 500: '#10b981', 600: '#059669' },
        warning: { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
        danger:  { 400: '#f87171', 500: '#ef4444', 600: '#dc2626' },
        info:    { 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb' },
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-brand':  'linear-gradient(135deg, #0a8c89 0%, #2caa9c 100%)',
        'gradient-dark':   'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)',
        'gradient-card':   'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },

      boxShadow: {
        'glass':       '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        'glass-sm':    '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-lg':    '0 16px 64px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
        'glow':        '0 0 20px rgba(10, 140, 137, 0.4)',
        'glow-sm':     '0 0 10px rgba(10, 140, 137, 0.3)',
        'glow-accent': '0 0 20px rgba(44, 170, 156, 0.4)',
        'card':        '0 4px 24px rgba(0, 0, 0, 0.3)',
        'sidebar':     '4px 0 24px rgba(0, 0, 0, 0.4)',
      },

      backdropBlur: {
        xs: '2px',
      },

      borderRadius: {
        '4xl': '2rem',
      },

      animation: {
        'fade-in':     'fadeIn 0.3s ease-out',
        'slide-up':    'slideUp 0.4s ease-out',
        'slide-in':    'slideIn 0.3s ease-out',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':   'spin 3s linear infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
      },

      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },

      spacing: {
        '18': '4.5rem',
        '68': '17rem',
        '72': '18rem',
        '84': '21rem',
        '88': '22rem',
      },

      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
}
