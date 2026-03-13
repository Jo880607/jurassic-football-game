import { Inter, Orbitron } from 'next/font/google'
import './globals.css'
import { GameProvider } from '@/store/GameContext'
import { Toaster } from '@/components/ui/Toast'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-display' })

export const metadata = {
  title: '쥬라기 풋볼 - 선사시대 최강 축구 리그',
  description: '12종의 전설 공룡들과 함께하는 카드 배틀 축구 게임',
  manifest: '/manifest.json',
  themeColor: '#2D5016',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={`${inter.variable} ${orbitron.variable}`}>
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="font-sans bg-gradient-to-br from-jurassic-50 to-jurassic-100 min-h-screen">
        <GameProvider>
          <div id="root" className="flex flex-col min-h-screen">
            {children}
          </div>
          <Toaster />
          <PWAInstallPrompt />
        </GameProvider>
      </body>
    </html>
  )
}