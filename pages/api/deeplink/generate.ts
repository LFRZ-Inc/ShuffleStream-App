import type { NextApiRequest, NextApiResponse } from 'next'
import { generateDeepLink, DeepLinkOptions, DeepLinkResult, getExpectedBehaviorMessage } from '../../../lib/utils/deepLinkGenerator'

interface DeepLinkRequest {
  platform: string
  contentId: string
  contentType: 'movie' | 'tv'
  title: string
  deviceInfo?: {
    type: 'mobile' | 'tablet' | 'desktop' | 'smarttv'
    os: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown'
    browser: 'safari' | 'chrome' | 'firefox' | 'edge' | 'samsung' | 'unknown'
    isNativeAppCapable: boolean
    supportsDeepLinks: boolean
  }
}

interface DeepLinkResponse {
  success: boolean
  data?: DeepLinkResult & {
    expectedBehavior: string
    deviceOptimized: boolean
  }
  error?: string
}

interface ContentInfo {
  title: string
  platform: string
  netflixId?: string
  disneyId?: string
  huluId?: string
  hboId?: string
  paramountId?: string
  primeId?: string
  appleId?: string
  peacockId?: string
}

const PLATFORM_CONFIGS = {
  netflix: {
    webBase: 'https://www.netflix.com/title/',
    appScheme: 'netflix://title/',
    fallback: 'https://www.netflix.com',
    name: 'Netflix'
  },
  disney: {
    webBase: 'https://www.disneyplus.com/movies/',
    appScheme: 'disneyplus://content/',
    fallback: 'https://www.disneyplus.com',
    name: 'Disney+'
  },
  hulu: {
    webBase: 'https://www.hulu.com/movie/',
    appScheme: 'hulu://series/',
    fallback: 'https://www.hulu.com',
    name: 'Hulu'
  },
  prime: {
    webBase: 'https://www.amazon.com/dp/',
    appScheme: 'aiv://aiv/resume?asin=',
    fallback: 'https://www.amazon.com/prime-video',
    name: 'Prime Video'
  },
  hbo: {
    webBase: 'https://play.hbomax.com/page/',
    appScheme: 'hbomax://feature/',
    fallback: 'https://play.hbomax.com',
    name: 'HBO Max'
  },
  apple: {
    webBase: 'https://tv.apple.com/movie/',
    appScheme: 'com.apple.tv://movie/',
    fallback: 'https://tv.apple.com',
    name: 'Apple TV+'
  },
  paramount: {
    webBase: 'https://www.paramountplus.com/movies/',
    appScheme: 'paramountplus://content/',
    fallback: 'https://www.paramountplus.com',
    name: 'Paramount+'
  },
  peacock: {
    webBase: 'https://www.peacocktv.com/watch/asset/',
    appScheme: 'peacocktv://watch/',
    fallback: 'https://www.peacocktv.com',
    name: 'Peacock'
  }
}

// Mock content database for ID mapping
const CONTENT_DATABASE: Record<string, ContentInfo> = {
  '1': { title: 'Stranger Things', netflixId: '80057281', platform: 'netflix' },
  '2': { title: 'The Mandalorian', disneyId: 'the-mandalorian', platform: 'disney' },
  '3': { title: 'Dune', hboId: 'urn:hbo:feature:GYbX2vQKPDJCCwgEAAABc', platform: 'hbo' },
  '4': { title: 'The Bear', huluId: 'the-bear', platform: 'hulu' },
  '5': { title: 'Top Gun: Maverick', paramountId: 'top-gun-maverick', platform: 'paramount' }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeepLinkResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { platform, contentId, contentType, title, deviceInfo }: DeepLinkRequest = req.body

    if (!platform || !contentId || !contentType || !title) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: platform, contentId, contentType, title'
      })
    }

    const options: DeepLinkOptions = {
      platform: platform.toLowerCase(),
      contentId,
      contentType,
      title,
      deviceInfo
    }

    const deepLinkResult = generateDeepLink(options)
    const expectedBehavior = getExpectedBehaviorMessage(platform, contentType)
    const deviceOptimized = deviceInfo ? deviceInfo.isNativeAppCapable : false

    return res.status(200).json({
      success: true,
      data: {
        ...deepLinkResult,
        expectedBehavior,
        deviceOptimized
      }
    })

  } catch (error) {
    console.error('Deep link generation error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to generate deep link'
    })
  }
} 