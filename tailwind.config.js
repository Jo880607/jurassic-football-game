/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // 쥬라기 풋볼 브랜드 컬러
        jurassic: {
          50: '#f0f9e8',
          100: '#ddf2c7',
          500: '#2D5016', // Primary Green
          600: '#1f3b0f',
          900: '#0d1506',
        },
        amber: {
          400: '#FFD700', // 호박 골드
          500: '#f59e0b',
        },
        volcanic: {
          500: '#FF6B35', // 화산 오렌지
        },
        fossil: {
          400: '#8B7355', // 화석 그레이
          500: '#6b5b47',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'monospace'], // 게임 타이틀용
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-fast': 'pulse 1s infinite',
        'card-flip': 'cardFlip 0.6s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        cardFlip: {
          '0%': { transform: 'perspective(1000px) rotateY(0deg)' },
          '50%': { transform: 'perspective(1000px) rotateY(-90deg)' },
          '100%': { transform: 'perspective(1000px) rotateY(0deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        }
      }
    },
  },
  plugins: [],
}