import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "DeceptoNetEDU - Phishing Detection System",
  description: "Real-Time Phishing Pattern Recognition in Academic Infrastructure",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-serif ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
