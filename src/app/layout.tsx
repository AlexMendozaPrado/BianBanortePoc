import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Custom theme provider
import { ThemeProvider } from './components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BIAN POC - Banorte',
  description: 'Proof of Concept para exploración de capacidades BIAN',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
