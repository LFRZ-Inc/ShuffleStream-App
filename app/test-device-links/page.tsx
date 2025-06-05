'use client'

import { useState, useEffect } from 'react'
import { detectDevice, getDeviceDisplayName } from '../../lib/utils/deviceDetection'
import { generateDeepLink, getSupportedPlatforms, getPlatformDisplayName } from '../../lib/utils/deepLinkGenerator'
import SmartLaunchButton from '../components/SmartLaunchButton'

export default function TestDeviceLinksPage() {
  const [deviceInfo, setDeviceInfo] = useState<any>(null)
  const [testResults, setTestResults] = useState<any[]>([])

  useEffect(() => {
    const device = detectDevice()
    setDeviceInfo(device)

    // Generate test results for different platforms and content
    const testContent = [
      { platform: 'netflix', id: '80057281', type: 'movie' as const, title: 'Stranger Things' },
      { platform: 'disney', id: 'dplus_123', type: 'movie' as const, title: 'The Mandalorian' },
      { platform: 'hulu', id: 'hulu_456', type: 'tv' as const, title: 'The Handmaid\'s Tale' },
      { platform: 'prime', id: 'B08WJM4KNV', type: 'movie' as const, title: 'The Boys' },
      { platform: 'hbo', id: 'hbo_789', type: 'tv' as const, title: 'Game of Thrones' }
    ]

    const results = testContent.map(content => {
      const deepLink = generateDeepLink({
        platform: content.platform,
        contentId: content.id,
        contentType: content.type,
        title: content.title,
        deviceInfo: device
      })
      return { content, deepLink }
    })

    setTestResults(results)
  }, [])

  if (!deviceInfo) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading device detection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Device-Aware Deep Link Testing</h1>
        
        {/* Device Information */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Device Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p><strong>Device Type:</strong> {deviceInfo.type}</p>
              <p><strong>Operating System:</strong> {deviceInfo.os}</p>
              <p><strong>Browser:</strong> {deviceInfo.browser}</p>
            </div>
            <div>
              <p><strong>Display Name:</strong> {getDeviceDisplayName()}</p>
              <p><strong>Native App Capable:</strong> {deviceInfo.isNativeAppCapable ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Supports Deep Links:</strong> {deviceInfo.supportsDeepLinks ? '✅ Yes' : '❌ No'}</p>
            </div>
          </div>
        </div>

        {/* Platform Support */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Supported Platforms</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {getSupportedPlatforms().map(platform => (
              <div key={platform} className="bg-gray-700 rounded-lg p-3 text-center">
                <p className="font-medium">{getPlatformDisplayName(platform)}</p>
                <p className="text-sm text-gray-400">{platform}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Deep Link Test Results</h2>
          <div className="space-y-6">
            {testResults.map((result, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{result.content.title}</h3>
                    <p className="text-sm text-gray-400">
                      {getPlatformDisplayName(result.content.platform)} • {result.content.type}
                    </p>
                  </div>
                  <SmartLaunchButton
                    platform={result.content.platform}
                    contentId={result.content.id}
                    contentType={result.content.type}
                    title={result.content.title}
                    size="sm"
                    showExpectedBehavior={false}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Launch Method:</strong> {result.deepLink.launchMethod}</p>
                    <p><strong>Platform:</strong> {result.deepLink.platform}</p>
                    <p><strong>Requires Timeout:</strong> {result.deepLink.requiresTimeout ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p><strong>Primary URL:</strong></p>
                    <p className="text-blue-400 break-all text-xs">{result.deepLink.primaryUrl}</p>
                    {result.deepLink.fallbackUrl !== result.deepLink.primaryUrl && (
                      <>
                        <p className="mt-2"><strong>Fallback URL:</strong></p>
                        <p className="text-green-400 break-all text-xs">{result.deepLink.fallbackUrl}</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mt-3 p-3 bg-gray-600 rounded text-sm">
                  <strong>User Message:</strong> {result.deepLink.userMessage}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device-Specific Recommendations */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Device-Specific Behavior</h2>
          <div className="space-y-4">
            {deviceInfo.type === 'mobile' && (
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-blue-300">📱 Mobile Device Detected</h3>
                <p className="text-sm text-blue-200 mt-2">
                  The system will try to launch native apps first, then fallback to browser versions if apps aren't installed.
                  This provides the best user experience on mobile devices.
                </p>
              </div>
            )}
            
            {deviceInfo.type === 'desktop' && (
              <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-green-300">🖥️ Desktop Device Detected</h3>
                <p className="text-sm text-green-200 mt-2">
                  Links will open directly in your browser. Consider installing platform apps for a better viewing experience.
                </p>
              </div>
            )}
            
            {deviceInfo.type === 'tablet' && (
              <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-purple-300">📱 Tablet Device Detected</h3>
                <p className="text-sm text-purple-200 mt-2">
                  Similar to mobile, the system will attempt native app launches with browser fallbacks.
                  Tablet apps often provide better viewing experiences than browser versions.
                </p>
              </div>
            )}
            
            {deviceInfo.type === 'smarttv' && (
              <div className="bg-orange-600/20 border border-orange-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-orange-300">📺 Smart TV Detected</h3>
                <p className="text-sm text-orange-200 mt-2">
                  Links will open in your TV's browser. For the best experience, use your TV's built-in streaming apps directly.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
} 