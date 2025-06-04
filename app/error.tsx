'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
        <div className="relative bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-full p-6">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 text-center">
        Something went wrong!
      </h2>
      
      <p className="text-gray-400 mb-8 max-w-md text-center">
        We encountered an unexpected error. Our team has been notified and is working on a fix.
      </p>

      <button
        onClick={reset}
        className="btn-primary flex items-center gap-2"
      >
        <RefreshCw className="w-5 h-5" />
        Try again
      </button>
    </div>
  )
} 