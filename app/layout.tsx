import type React from "react"
import { Parkinsans } from "next/font/google"
import "./globals.css"

const parkinsans = Parkinsans({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  variable: "--font-parkinsans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${parkinsans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
