import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bartending Academy - Master the Art of Mixology',
  description: 'Interactive learning platform for aspiring bartenders. Learn drink recipes, techniques, and test your knowledge with quizzes and games.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
