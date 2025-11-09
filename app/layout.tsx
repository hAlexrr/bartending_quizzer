import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/layout/Navigation'

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
      <body>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  )
}
