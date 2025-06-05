import type { NextApiRequest, NextApiResponse } from 'next'

interface DeepLinkRequest {
  contentId: string
  platform: string
  contentType: 'movie' | 'tv'
  season?: number
  episode?: number
}

interface DeepLinkResponse {
  success: boolean
  data?: {
    webUrl: string
    appUrl: string
    fallbackUrl: string
    platform: string
    contentTitle: string
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
    const { contentId, platform, contentType, season, episode }: DeepLinkRequest = req.body

    if (!contentId || !platform) {
      return res.status(400).json({
        success: false,
        error: 'Content ID and platform are required'
      })
    }

    const platformConfig = PLATFORM_CONFIGS[platform as keyof typeof PLATFORM_CONFIGS]
    if (!platformConfig) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported platform'
      })
    }

    // Get content info from mock database
    const content = CONTENT_DATABASE[contentId as keyof typeof CONTENT_DATABASE]
    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      })
    }

    // Generate platform-specific URLs
    let webUrl: string
    let appUrl: string

    switch (platform) {
      case 'netflix':
        const netflixId = content.netflixId || contentId
        webUrl = `${platformConfig.webBase}${netflixId}`
        appUrl = `${platformConfig.appScheme}${netflixId}`
        if (season && episode) {
          webUrl += `?trackId=14170286&tctx=0%2C${season}%2C${episode}`
          appUrl += `?season=${season}&episode=${episode}`
        }
        break

      case 'disney':
        const disneyId = content.disneyId || contentId
        webUrl = `${platformConfig.webBase}${disneyId}`
        appUrl = `${platformConfig.appScheme}${contentType}/${disneyId}`
        break

      case 'hulu':
        const huluId = content.huluId || contentId
        webUrl = contentType === 'movie' 
          ? `https://www.hulu.com/movie/${huluId}`
          : `https://www.hulu.com/series/${huluId}`
        appUrl = `${platformConfig.appScheme}${huluId}`
        if (season && episode) {
          appUrl += `?season=${season}&episode=${episode}`
        }
        break

      case 'prime':
        webUrl = `${platformConfig.webBase}${contentId}`
        appUrl = `${platformConfig.appScheme}${contentId}`
        break

      case 'hbo':
        const hboId = content.hboId || contentId
        webUrl = `${platformConfig.webBase}${hboId}`
        appUrl = `${platformConfig.appScheme}${hboId}`
        break

      case 'apple':
        webUrl = `${platformConfig.webBase}${contentId}`
        appUrl = `${platformConfig.appScheme}${contentId}`
        break

      case 'paramount':
        const paramountId = content.paramountId || contentId
        webUrl = `${platformConfig.webBase}${paramountId}`
        appUrl = `${platformConfig.appScheme}${contentType}/${paramountId}`
        break

      case 'peacock':
        webUrl = `${platformConfig.webBase}${contentId}`
        appUrl = `${platformConfig.appScheme}${contentId}`
        break

      default:
        webUrl = platformConfig.fallback
        appUrl = platformConfig.fallback
    }

    return res.status(200).json({
      success: true,
      data: {
        webUrl,
        appUrl,
        fallbackUrl: platformConfig.fallback,
        platform: platformConfig.name,
        contentTitle: content.title
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