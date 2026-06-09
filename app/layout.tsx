import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VetPass Pro — Espace vétérinaire',
  description: 'La fiche médicale complète de vos patients en un scan. Plateforme vétérinaire VetPass.',
  keywords: ['vétérinaire', 'carnet santé animal', 'VetPass', 'fiche médicale'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="antialiased bg-[#FBF9F4]">{children}</body>
    </html>
  )
}
