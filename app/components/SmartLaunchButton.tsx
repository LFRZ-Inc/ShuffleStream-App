'use client'

import { useState } from 'react'
import { detectDevice, getDeviceDisplayName } from '../../lib/utils/deviceDetection'
import { generateDeepLink, launchContent, getExpectedBehaviorMessage } from '../../lib/utils/deepLinkGenerator'

interface SmartLaunchButtonProps {
  platform: string
  contentId: string
  contentType: 'movie' | 'tv'
  title: string
  className?: string
  children?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  showExpectedBehavior?: boolean
}

export default function SmartLaunchButton({
  platform,
  contentId,
  contentType,
  title,
  className = '',
  children,
  variant = 'primary',
  size = 'md',
  showExpectedBehavior = true
}: SmartLaunchButtonProps) {
  const [isLaunching, setIsLaunching] = useState(false)
  const [launchStatus, setLaunchStatus] = useState<'idle' | 'launching' | 'success' | 'fallback'>('idle')
  const [showTooltip, setShowTooltip] = useState(false)

  const device = detectDevice()
  const deviceName = getDeviceDisplayName()

  const handleLaunch = async () => {
    setIsLaunching(true)
    setLaunchStatus('launching')

    try {
      const deepLinkResult = generateDeepLink({
        platform,
        contentId,
        contentType,
        title,
        deviceInfo: device
      })

      const success = await launchContent(deepLinkResult)
      
      if (success) {
        setLaunchStatus('success')
      } else {
        setLaunchStatus('fallback')
      }

      // Reset status after a delay
      setTimeout(() => {
        setLaunchStatus('idle')
      }, 3000)

    } catch (error) {
      console.error('Launch error:', error)
      setLaunchStatus('fallback')
      setTimeout(() => {
        setLaunchStatus('idle')
      }, 3000)
    } finally {
      setIsLaunching(false)
    }
  }

  const getButtonVariantClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    }

    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500'
    }

    const statusClasses: Record<string, string> = {
      launching: 'opacity-75 cursor-not-allowed',
      success: 'bg-green-600 hover:bg-green-600',
      fallback: 'bg-orange-600 hover:bg-orange-600'
    }

    const statusClass = statusClasses[launchStatus] || ''

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${statusClass} ${className}`
  }

  const getButtonContent = () => {
    if (isLaunching) {
      return (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Launching...
        </>
      )
    }

    if (launchStatus === 'success') {
      return (
        <>
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Launched!
        </>
      )
    }

    if (launchStatus === 'fallback') {
      return (
        <>
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          Opened in Browser
        </>
      )
    }

    return children || 'Watch Now'
  }

  const expectedBehavior = getExpectedBehaviorMessage(platform, contentType)

  return (
    <div className="relative">
      <button
        onClick={handleLaunch}
        disabled={isLaunching}
        className={getButtonVariantClasses()}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title={`Launch on ${deviceName}`}
      >
        {getButtonContent()}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-50">
          <div className="font-medium">Launch on {deviceName}</div>
          {device.isNativeAppCapable && (
            <div className="text-gray-300">Tries app first, then browser</div>
          )}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Expected Behavior Message */}
      {showExpectedBehavior && (
        <div className="mt-2 text-xs text-gray-600">
          {expectedBehavior}
        </div>
      )}

      {/* Device-specific hints */}
      {device.type === 'desktop' && (
        <div className="mt-1 text-xs text-gray-500">
          💡 Install the app for a better experience
        </div>
      )}

      {device.type === 'smarttv' && (
        <div className="mt-1 text-xs text-gray-500">
          📺 Use your TV's app for the best experience
        </div>
      )}
    </div>
  )
} 