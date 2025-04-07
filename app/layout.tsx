import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SHL Assessment Recommendation System",
  description: "Find the perfect SHL assessments for your hiring needs",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white border-b">
          <div className="container mx-auto py-4 px-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              SHL Recommender
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
              <Link href="/evaluation" className="hover:text-blue-600">
                Evaluation
              </Link>
              <Link href="/approach" className="hover:text-blue-600">
                Our Approach
              </Link>
              <Link href="/api/recommend?query=Java%20developer" className="hover:text-blue-600" target="_blank">
                API
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}



import './globals.css'