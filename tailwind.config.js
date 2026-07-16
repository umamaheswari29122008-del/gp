/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        ice: {
          50: '#f0fbff',
          100: '#e0f7fe',
          200: '#b9edfd',
          300: '#7ddcfb',
          400: '#38c9f7',
          500: '#0db2e8',
          600: '#0190c6',
          700: '#0272a0',
          800: '#065f84',
          900: '#0b506e',
        },
        arctic: {
          50: '#f7fbff',
          100: '#eef6fe',
          200: '#d6ebfc',
          300: '#aed6f9',
          400: '#7bbaf4',
          500: '#4f9aed',
          600: '#2e7ce0',
          700: '#2464cc',
          800: '#2352a5',
          900: '#1e3f7a',
        },
        navy: {
          900: '#030c1e',
          800: '#051022',
          700: '#071528',
          600: '#0a1d35',
          500: '#0d2540',
          400: '#122d4d',
        },
      },
      backgroundImage: {
        'ice-gradient': 'linear-gradient(135deg, #030c1e 0%, #071528 40%, #0a1d35 100%)',
        'glow-radial': 'radial-gradient(ellipse at center, rgba(13,178,232,0.15) 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'snow': 'snow 8s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.8s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        snow: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.8' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(13,178,232,0.3)' },
          '50%': { boxShadow: '0 0 50px rgba(13,178,232,0.7)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
