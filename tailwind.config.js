/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 치치의 브랜딩 컬러 적용
        primary: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          500: '#FF8C00', // 호박색 메인
          600: '#EA580C',
          700: '#C2410C',
          900: '#9A3412',
        },
        secondary: {
          sunset: '#FF6B35',
          golden: '#FFD700',
          jungle: '#228B22',
          sky: '#87CEEB',
          brown: '#8B4513',
        },
        game: {
          common: '#94A3B8',
          uncommon: '#22C55E',
          rare: '#3B82F6',
          epic: '#8B5CF6',
          legendary: '#F59E0B',
        }
      },
      fontFamily: {
        'game': ['Nunito', 'sans-serif'],
        'korean': ['Noto Sans KR', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'card-flip': 'cardFlip 0.8s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0%)', opacity: '1' },
        }
      },
      screens: {
        'xs': '475px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}