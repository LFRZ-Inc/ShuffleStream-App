export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop' | 'smarttv'
  os: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'
  browser: 'safari' | 'chrome' | 'firefox' | 'edge' | 'samsung' | 'unknown'
  isNativeAppCapable: boolean
  supportsDeepLinks: boolean
}

export function detectDevice(): DeviceInfo {
  // Default fallback for server-side rendering
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      type: 'desktop',
      os: 'unknown',
      browser: 'unknown',
      isNativeAppCapable: false,
      supportsDeepLinks: false
    }
  }

  const userAgent = navigator.userAgent.toLowerCase()
  const platform = navigator.platform?.toLowerCase() || ''
  
  // Detect OS
  let os: DeviceInfo['os'] = 'unknown'
  if (/iphone|ipad|ipod/.test(userAgent)) {
    os = 'ios'
  } else if (/android/.test(userAgent)) {
    os = 'android'
  } else if (/win/.test(platform)) {
    os = 'windows'
  } else if (/mac/.test(platform)) {
    os = 'macos'
  } else if (/linux/.test(platform)) {
    os = 'linux'
  }

  // Detect browser
  let browser: DeviceInfo['browser'] = 'unknown'
  if (/safari/.test(userAgent) && !/chrome/.test(userAgent)) {
    browser = 'safari'
  } else if (/chrome/.test(userAgent)) {
    browser = 'chrome'
  } else if (/firefox/.test(userAgent)) {
    browser = 'firefox'
  } else if (/edge/.test(userAgent)) {
    browser = 'edge'
  } else if (/samsungbrowser/.test(userAgent)) {
    browser = 'samsung'
  }

  // Detect device type
  let type: DeviceInfo['type'] = 'desktop'
  
  // Smart TV detection
  if (/smart-tv|smarttv|googletv|appletv|roku|webos|tizen/.test(userAgent)) {
    type = 'smarttv'
  }
  // Mobile detection
  else if (/iphone|android.*mobile/.test(userAgent)) {
    type = 'mobile'
  }
  // Tablet detection
  else if (/ipad|android(?!.*mobile)/.test(userAgent)) {
    type = 'tablet'
  }
  // Additional mobile indicators
  else if (window.innerWidth <= 768 && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    type = 'mobile'
  }

  // Determine capabilities
  const isNativeAppCapable = (type === 'mobile' || type === 'tablet') && (os === 'ios' || os === 'android')
  const supportsDeepLinks = isNativeAppCapable || type === 'desktop'

  return {
    type,
    os,
    browser,
    isNativeAppCapable,
    supportsDeepLinks
  }
}

export function isMobile(): boolean {
  const device = detectDevice()
  return device.type === 'mobile'
}

export function isTablet(): boolean {
  const device = detectDevice()
  return device.type === 'tablet'
}

export function isDesktop(): boolean {
  const device = detectDevice()
  return device.type === 'desktop'
}

export function isSmartTV(): boolean {
  const device = detectDevice()
  return device.type === 'smarttv'
}

export function isiOS(): boolean {
  const device = detectDevice()
  return device.os === 'ios'
}

export function isAndroid(): boolean {
  const device = detectDevice()
  return device.os === 'android'
}

export function canLaunchNativeApps(): boolean {
  const device = detectDevice()
  return device.isNativeAppCapable
}

export function getDeviceDisplayName(): string {
  const device = detectDevice()
  
  if (device.type === 'smarttv') return 'Smart TV'
  if (device.type === 'mobile') {
    if (device.os === 'ios') return 'iPhone'
    if (device.os === 'android') return 'Android Phone'
    return 'Mobile Device'
  }
  if (device.type === 'tablet') {
    if (device.os === 'ios') return 'iPad'
    if (device.os === 'android') return 'Android Tablet'
    return 'Tablet'
  }
  
  return 'Desktop'
} 