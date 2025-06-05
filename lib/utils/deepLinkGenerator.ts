import { detectDevice, DeviceInfo } from './deviceDetection'

export interface DeepLinkOptions {
  platform: string
  contentId: string
  contentType: 'movie' | 'tv'
  title: string
  deviceInfo?: DeviceInfo
}

export interface DeepLinkResult {
  primaryUrl: string
  fallbackUrl: string
  launchMethod: 'native' | 'web' | 'hybrid'
  userMessage: string
  platform: string
  requiresTimeout: boolean
}

// Platform-specific deep link configurations
const PLATFORM_CONFIGS = {
  netflix: {
    name: 'Netflix',
    nativeSchemes: {
      ios: 'nflx://www.netflix.com/title/',
      android: 'nflx://www.netflix.com/title/'
    },
    webUrl: 'https://www.netflix.com/title/',
    intentUrl: 'intent://www.netflix.com/title/{id}#Intent;package=com.netflix.mediaclient;scheme=nflx;end'
  },
  disney: {
    name: 'Disney+',
    nativeSchemes: {
      ios: 'disneyplus://title/',
      android: 'disneyplus://title/'
    },
    webUrl: 'https://www.disneyplus.com/title/',
    intentUrl: 'intent://title/{id}#Intent;package=com.disney.disneyplus;scheme=disneyplus;end'
  },
  hulu: {
    name: 'Hulu',
    nativeSchemes: {
      ios: 'hulu://watch/',
      android: 'hulu://watch/'
    },
    webUrl: 'https://www.hulu.com/watch/',
    intentUrl: 'intent://watch/{id}#Intent;package=com.hulu.plus;scheme=hulu;end'
  },
  prime: {
    name: 'Prime Video',
    nativeSchemes: {
      ios: 'aiv://aiv/resume?asin=',
      android: 'aiv://aiv/resume?asin='
    },
    webUrl: 'https://www.amazon.com/dp/',
    intentUrl: 'intent://aiv/resume?asin={id}#Intent;package=com.amazon.avod.thirdpartyclient;scheme=aiv;end'
  },
  hbo: {
    name: 'HBO Max',
    nativeSchemes: {
      ios: 'hbomax://title/',
      android: 'hbomax://title/'
    },
    webUrl: 'https://play.hbomax.com/title/',
    intentUrl: 'intent://title/{id}#Intent;package=com.hbo.hbonow;scheme=hbomax;end'
  },
  apple: {
    name: 'Apple TV+',
    nativeSchemes: {
      ios: 'com.apple.tv://title/',
      android: 'appletv://title/'
    },
    webUrl: 'https://tv.apple.com/title/',
    intentUrl: 'intent://title/{id}#Intent;package=com.apple.atve.androidtv.appletv;scheme=appletv;end'
  },
  paramount: {
    name: 'Paramount+',
    nativeSchemes: {
      ios: 'cbsaa://title/',
      android: 'cbsaa://title/'
    },
    webUrl: 'https://www.paramountplus.com/title/',
    intentUrl: 'intent://title/{id}#Intent;package=com.cbs.app;scheme=cbsaa;end'
  },
  peacock: {
    name: 'Peacock',
    nativeSchemes: {
      ios: 'peacocktv://title/',
      android: 'peacocktv://title/'
    },
    webUrl: 'https://www.peacocktv.com/title/',
    intentUrl: 'intent://title/{id}#Intent;package=com.peacocktv.peacockandroid;scheme=peacocktv;end'
  }
}

export function generateDeepLink(options: DeepLinkOptions): DeepLinkResult {
  const { platform, contentId, contentType, title, deviceInfo } = options
  const device = deviceInfo || detectDevice()
  const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS]
  
  if (!config) {
    // Fallback for unknown platforms
    return {
      primaryUrl: `https://www.google.com/search?q=${encodeURIComponent(title)}+${platform}`,
      fallbackUrl: `https://www.google.com/search?q=${encodeURIComponent(title)}+${platform}`,
      launchMethod: 'web',
      userMessage: `Search for "${title}" on ${platform}`,
      platform,
      requiresTimeout: false
    }
  }

  const platformName = config.name
  const baseMessage = `Opens "${title}" in ${platformName}`
  
  // Smart TV handling
  if (device.type === 'smarttv') {
    return {
      primaryUrl: config.webUrl + contentId,
      fallbackUrl: config.webUrl + contentId,
      launchMethod: 'web',
      userMessage: `${baseMessage}. Use your TV's ${platformName} app for the best experience.`,
      platform: platformName,
      requiresTimeout: false
    }
  }
  
  // Desktop handling
  if (device.type === 'desktop') {
    return {
      primaryUrl: config.webUrl + contentId,
      fallbackUrl: config.webUrl + contentId,
      launchMethod: 'web',
      userMessage: `${baseMessage} in your browser. Install the ${platformName} app for a better experience.`,
      platform: platformName,
      requiresTimeout: false
    }
  }
  
  // Mobile/Tablet handling with native app support
  if (device.isNativeAppCapable) {
    let nativeUrl = ''
    let intentUrl = ''
    
    if (device.os === 'ios' && config.nativeSchemes.ios) {
      nativeUrl = config.nativeSchemes.ios + contentId
    } else if (device.os === 'android') {
      if (config.nativeSchemes.android) {
        nativeUrl = config.nativeSchemes.android + contentId
      }
      if (config.intentUrl) {
        intentUrl = config.intentUrl.replace('{id}', contentId)
      }
    }
    
    const fallbackUrl = config.webUrl + contentId
    
    // Android with intent support
    if (device.os === 'android' && intentUrl) {
      return {
        primaryUrl: intentUrl,
        fallbackUrl: fallbackUrl,
        launchMethod: 'hybrid',
        userMessage: `${baseMessage} app. If the app isn't installed, it will open in your browser.`,
        platform: platformName,
        requiresTimeout: true
      }
    }
    
    // iOS or Android with native scheme
    if (nativeUrl) {
      return {
        primaryUrl: nativeUrl,
        fallbackUrl: fallbackUrl,
        launchMethod: 'hybrid',
        userMessage: `${baseMessage} app. If the app isn't installed, it will open in your browser.`,
        platform: platformName,
        requiresTimeout: true
      }
    }
  }
  
  // Fallback to web
  return {
    primaryUrl: config.webUrl + contentId,
    fallbackUrl: config.webUrl + contentId,
    launchMethod: 'web',
    userMessage: `${baseMessage} in your browser. Install the ${platformName} app for a better experience.`,
    platform: platformName,
    requiresTimeout: false
  }
}

export function launchContent(deepLinkResult: DeepLinkResult): Promise<boolean> {
  return new Promise((resolve) => {
    const { primaryUrl, fallbackUrl, launchMethod, requiresTimeout } = deepLinkResult
    
    if (launchMethod === 'web') {
      // Direct web launch
      window.open(primaryUrl, '_blank')
      resolve(true)
      return
    }
    
    if (launchMethod === 'hybrid' && requiresTimeout) {
      // Try native app first, fallback to web if it fails
      let hasLaunched = false
      
      // Set up fallback timer
      const fallbackTimer = setTimeout(() => {
        if (!hasLaunched) {
          hasLaunched = true
          window.open(fallbackUrl, '_blank')
          resolve(false) // Indicates fallback was used
        }
      }, 2500) // 2.5 second timeout
      
      // Try to launch native app
      const startTime = Date.now()
      
      // Create invisible iframe to trigger deep link
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = primaryUrl
      document.body.appendChild(iframe)
      
      // Clean up iframe after a short delay
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 1000)
      
      // Check if we left the page (indicating successful app launch)
      const checkVisibility = () => {
        if (document.hidden || Date.now() - startTime > 2000) {
          if (!hasLaunched) {
            hasLaunched = true
            clearTimeout(fallbackTimer)
            resolve(true) // Native app launched successfully
          }
        }
      }
      
      document.addEventListener('visibilitychange', checkVisibility)
      
      // Cleanup listener after timeout
      setTimeout(() => {
        document.removeEventListener('visibilitychange', checkVisibility)
      }, 3000)
      
    } else {
      // Direct native launch without fallback
      window.open(primaryUrl, '_blank')
      resolve(true)
    }
  })
}

export function getExpectedBehaviorMessage(platform: string, contentType: 'movie' | 'tv'): string {
  const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS]
  const platformName = config?.name || platform
  
  if (contentType === 'tv') {
    return `This will open the series page in ${platformName}. Select your episode inside the app.`
  } else {
    return `This will open the movie in ${platformName}. You may need to rent or purchase if not included in your subscription.`
  }
}

export function getSupportedPlatforms(): string[] {
  return Object.keys(PLATFORM_CONFIGS)
}

export function getPlatformDisplayName(platform: string): string {
  const config = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS]
  return config?.name || platform
} 