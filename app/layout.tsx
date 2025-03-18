import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { FavoritesProvider } from "@/components/favorites-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Marvel Characters Explorer",
  description: "Explore Marvel characters and their comics",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FavoritesProvider>{children}</FavoritesProvider>
      </body>
    </html>
  )
}



import './globals.css'