import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { iconConfig } from './icon'
import { AuthProvider } from '@/hooks/useAuth'
import { DemoBanner } from '@/components/DemoBanner'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'ShuffleStream - Your Smarter Way to Stream',
  description: 'Connect all your streaming platforms and discover content with advanced shuffle features. Never wonder what to watch again.',
  keywords: ['streaming', 'netflix', 'disney+', 'hulu', 'shuffle', 'recommendations'],
  authors: [{ name: 'ShuffleStream Team' }],
  creator: 'ShuffleStream',
  publisher: 'ShuffleStream',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://shufflestream.app'),
  icons: iconConfig,
  openGraph: {
    title: 'ShuffleStream - Your Smarter Way to Stream',
    description: 'Connect all your streaming platforms and discover content with advanced shuffle features.',
    url: 'https://shufflestream.app',
    siteName: 'ShuffleStream',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShuffleStream - Smart Streaming Assistant',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShuffleStream - Your Smarter Way to Stream',
    description: 'Connect all your streaming platforms and discover content with advanced shuffle features.',
    images: ['/og-image.png'],
    creator: '@shufflestream',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} dark`}>
      <body className={`${inter.className} antialiased bg-gray-900 text-white`}>
        <DemoBanner />
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1F2937',
                color: '#fff',
                borderRadius: '10px',
                padding: '16px',
                fontSize: '14px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
} 