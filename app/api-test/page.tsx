'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, Play, ExternalLink } from 'lucide-react'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  data?: any
  error?: string
}

export default function APITestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Content Discovery API', status: 'pending' },
    { name: 'Shuffle Generation API', status: 'pending' },
    { name: 'Authentication API', status: 'pending' },
    { name: 'Deep Link API', status: 'pending' },
    { name: 'User Lists API', status: 'pending' }
  ])
  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (name: string, status: 'success' | 'error', data?: any, error?: string) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, status, data, error } : test
    ))
  }

  const runAllTests = async () => {
    setIsRunning(true)
    
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' })))

    // Test 1: Content Discovery API
    try {
      const response = await fetch('/api/content/discover?type=all&page=1')
      const result = await response.json()
      
      if (result.success) {
        updateTest('Content Discovery API', 'success', result.data)
      } else {
        updateTest('Content Discovery API', 'error', null, result.error)
      }
    } catch (error) {
      updateTest('Content Discovery API', 'error', null, 'Network error')
    }

    // Test 2: Shuffle Generation API
    try {
      const response = await fetch('/api/shuffle/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'full',
          platforms: ['netflix', 'disney'],
          contentType: 'all'
        })
      })
      const result = await response.json()
      
      if (result.success) {
        updateTest('Shuffle Generation API', 'success', result.data)
      } else {
        updateTest('Shuffle Generation API', 'error', null, result.error)
      }
    } catch (error) {
      updateTest('Shuffle Generation API', 'error', null, 'Network error')
    }

    // Test 3: Authentication API
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'demo@shufflestream.com',
          password: 'demo123'
        })
      })
      const result = await response.json()
      
      if (result.success) {
        updateTest('Authentication API', 'success', result.data)
      } else {
        updateTest('Authentication API', 'error', null, result.error)
      }
    } catch (error) {
      updateTest('Authentication API', 'error', null, 'Network error')
    }

    // Test 4: Deep Link API
    try {
      const response = await fetch('/api/deeplink/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: '1',
          platform: 'netflix',
          contentType: 'tv'
        })
      })
      const result = await response.json()
      
      if (result.success) {
        updateTest('Deep Link API', 'success', result.data)
      } else {
        updateTest('Deep Link API', 'error', null, result.error)
      }
    } catch (error) {
      updateTest('Deep Link API', 'error', null, 'Network error')
    }

    // Test 5: User Lists API
    try {
      const response = await fetch('/api/user/lists')
      const result = await response.json()
      
      if (result.success) {
        updateTest('User Lists API', 'success', result.data)
      } else {
        updateTest('User Lists API', 'error', null, result.error)
      }
    } catch (error) {
      updateTest('User Lists API', 'error', null, 'Network error')
    }

    setIsRunning(false)
  }

  const testDeepLink = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">ShuffleStream API Test Suite</h1>
          <p className="text-gray-400">Test all production APIs to ensure they're working correctly</p>
        </div>

        <div className="mb-6">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run All Tests
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          {tests.map((test, index) => (
            <motion.div
              key={test.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{test.name}</h3>
                <div className="flex items-center gap-2">
                  {test.status === 'pending' && (
                    <div className="w-6 h-6 rounded-full bg-gray-600" />
                  )}
                  {test.status === 'success' && (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  )}
                  {test.status === 'error' && (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    test.status === 'success' ? 'text-green-400' :
                    test.status === 'error' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {test.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {test.error && (
                <div className="mb-4 p-3 bg-red-600/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-sm">{test.error}</p>
                </div>
              )}

              {test.data && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Response Data:</h4>
                  
                  {/* Special handling for different API responses */}
                  {test.name === 'Content Discovery API' && test.data && (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-400">Movies:</span> {test.data.movies?.length || 0}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-400">TV Shows:</span> {test.data.tvShows?.length || 0}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-400">Total Results:</span> {test.data.totalResults || 0}
                      </p>
                    </div>
                  )}

                  {test.name === 'Shuffle Generation API' && test.data && (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-400">Recommendation:</span> {test.data.recommendation?.title}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-400">Platform:</span> {test.data.recommendation?.platform}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-400">Alternatives:</span> {test.data.alternatives?.length || 0}
                      </p>
                    </div>
                  )}

                  {test.name === 'Authentication API' && test.data && (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-400">User:</span> {test.data.user?.name}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-400">Email:</span> {test.data.user?.email}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-400">Admin:</span> {test.data.user?.isAdmin ? 'Yes' : 'No'}
                      </p>
                    </div>
                  )}

                  {test.name === 'Deep Link API' && test.data && (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-400">Content:</span> {test.data.contentTitle}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-400">Platform:</span> {test.data.platform}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => testDeepLink(test.data.webUrl)}
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Test Web URL
                        </button>
                        <button
                          onClick={() => testDeepLink(test.data.appUrl)}
                          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Test App URL
                        </button>
                      </div>
                    </div>
                  )}

                  {test.name === 'User Lists API' && test.data && (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-400">Lists Found:</span> {test.data.length || 0}
                      </p>
                      {test.data.slice(0, 2).map((list: any, idx: number) => (
                        <p key={idx} className="text-sm">
                          <span className="text-gray-400">• {list.name}:</span> {list.items?.length || 0} items
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Fallback: show raw JSON for other responses */}
                  {!['Content Discovery API', 'Shuffle Generation API', 'Authentication API', 'Deep Link API', 'User Lists API'].includes(test.name) && (
                    <pre className="text-xs text-gray-300 overflow-x-auto">
                      {JSON.stringify(test.data, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Test Credentials</h3>
          <div className="text-sm text-gray-400 space-y-1">
            <p><strong>Demo User:</strong> demo@shufflestream.com / any password</p>
            <p><strong>Admin User:</strong> admin@shufflestream.com / any password</p>
            <p><strong>Note:</strong> All APIs use mock data for demonstration purposes</p>
          </div>
        </div>
      </div>
    </div>
  )
} 