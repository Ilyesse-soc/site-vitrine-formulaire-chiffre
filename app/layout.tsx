import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SecureTech - Solutions Technologiques Innovantes",
  description:
    "Développement web sécurisé, cybersécurité, applications mobiles et solutions cloud. Formulaire de contact chiffré AES/RSA avec protection anti-spam.",
  keywords: "développement web, cybersécurité, applications mobiles, cloud, chiffrement, sécurité",
  authors: [{ name: "SecureTech" }],
  openGraph: {
    title: "SecureTech - Solutions Technologiques Innovantes",
    description: "Spécialistes en développement sécurisé et cybersécurité",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
