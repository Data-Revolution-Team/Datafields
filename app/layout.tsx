import type React from "react"
import type { Metadata } from "next"
import { Parkinsans } from "next/font/google"
import "./globals.css"

const parkinsans = Parkinsans({
    subsets: ["latin"],
    weight: ["600"],
    display: "swap",
    variable: "--font-parkinsans",
})

export const metadata: Metadata = {
    title: "Datafields",
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
}

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
