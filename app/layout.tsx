import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pathfinder – Scholarship Intelligence',
  description: 'Your personal scholarship intelligence platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
