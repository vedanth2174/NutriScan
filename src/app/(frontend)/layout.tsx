import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'NutriScan',
  description: 'AI-powered personalized nutrition, food scanning, planning, and progress insights.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'NutriScan',
    description: 'AI-powered personalized nutrition, food scanning, planning, and progress insights.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0B0B0C] text-[#F7F7F5] antialiased">
        <div id="root" tabIndex={-1}>{children}</div>
      </body>
    </html>
  )
}
