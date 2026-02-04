import React from "react"
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: '스터디모여',
  description: '스터디모여에서 나에게 맞는 스터디를 찾고, 함께 성장하세요.',
  verification: {
    google: '4e2r2zjXjtl4oGhu-I6US1gbGsFVUG4XV_ABRSHib2w',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
