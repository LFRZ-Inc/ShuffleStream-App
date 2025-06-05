import type { NextApiRequest, NextApiResponse } from 'next'

interface ShuffleRequest {
  mode: 'full' | 'preference' | 'show' | 'list' | 'platform'
  platforms?: string[]
  genres?: string[]
  contentType?: 'movie' | 'tv' | 'all'
  mood?: string
  listId?: string
  showId?: string
  userId?: string
}

interface ContentItem {
  id: number
  title: string
  type: 'movie' | 'tv'
  platform: string
  genre: string[]
  rating: number
  year: number
  duration: string
  description: string
  poster: string
  deepLink: string
  watchUrl: string
}

interface ShuffleResponse {
  success: boolean
  data?: {
    recommendation: ContentItem
    alternatives: ContentItem[]
    shuffleId: string
    mode: string
  }
  error?: string
}

const PLATFORM_DEEP_LINKS = {
  netflix: 'https://www.netflix.com/title/',
  disney: 'https://www.disneyplus.com/movies/',
  hulu: 'https://www.hulu.com/movie/',
  prime: 'https://www.amazon.com/dp/',
  hbo: 'https://play.hbomax.com/page/',
  apple: 'https://tv.apple.com/movie/',
  paramount: 'https://www.paramountplus.com/movies/',
  peacock: 'https://www.peacocktv.com/watch/asset/'
}

const MOCK_CONTENT: ContentItem[] = [
  {
    id: 1,
    title: "Stranger Things",
    type: "tv",
    platform: "netflix",
    genre: ["Drama", "Horror", "Sci-Fi"],
    rating: 8.7,
    year: 2016,
    duration: "51m per episode",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments.",
    poster: "/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
    deepLink: `${PLATFORM_DEEP_LINKS.netflix}80057281`,
    watchUrl: "netflix://title/80057281"
  },
  {
    id: 2,
    title: "The Mandalorian",
    type: "tv",
    platform: "disney",
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: 8.7,
    year: 2019,
    duration: "40m per episode",
    description: "The travels of a lone bounty hunter in the outer reaches of the galaxy.",
    poster: "/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
    deepLink: `${PLATFORM_DEEP_LINKS.disney}the-mandalorian`,
    watchUrl: "disneyplus://content/series/the-mandalorian"
  },
  {
    id: 3,
    title: "Dune",
    type: "movie",
    platform: "hbo",
    genre: ["Action", "Adventure", "Drama"],
    rating: 8.0,
    year: 2021,
    duration: "155m",
    description: "Paul Atreides leads nomadic tribes in a revolt against the evil House Harkonnen.",
    poster: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    deepLink: `${PLATFORM_DEEP_LINKS.hbo}urn:hbo:feature:GYbX2vQKPDJCCwgEAAABc`,
    watchUrl: "hbomax://feature/urn:hbo:feature:GYbX2vQKPDJCCwgEAAABc"
  },
  {
    id: 4,
    title: "The Bear",
    type: "tv",
    platform: "hulu",
    genre: ["Comedy", "Drama"],
    rating: 8.7,
    year: 2022,
    duration: "30m per episode",
    description: "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop.",
    poster: "/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg",
    deepLink: `${PLATFORM_DEEP_LINKS.hulu}the-bear`,
    watchUrl: "hulu://series/the-bear"
  },
  {
    id: 5,
    title: "Top Gun: Maverick",
    type: "movie",
    platform: "paramount",
    genre: ["Action", "Drama"],
    rating: 8.3,
    year: 2022,
    duration: "130m",
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator.",
    poster: "/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    deepLink: `${PLATFORM_DEEP_LINKS.paramount}top-gun-maverick`,
    watchUrl: "paramountplus://content/movies/top-gun-maverick"
  }
]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShuffleResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const shuffleRequest: ShuffleRequest = req.body

    // Filter content based on shuffle parameters
    let filteredContent = [...MOCK_CONTENT]

    // Filter by platforms
    if (shuffleRequest.platforms && shuffleRequest.platforms.length > 0) {
      filteredContent = filteredContent.filter(item => 
        shuffleRequest.platforms!.includes(item.platform)
      )
    }

    // Filter by content type
    if (shuffleRequest.contentType && shuffleRequest.contentType !== 'all') {
      filteredContent = filteredContent.filter(item => 
        item.type === shuffleRequest.contentType
      )
    }

    // Filter by genres
    if (shuffleRequest.genres && shuffleRequest.genres.length > 0) {
      filteredContent = filteredContent.filter(item =>
        item.genre.some(genre => shuffleRequest.genres!.includes(genre))
      )
    }

    // Apply shuffle mode logic
    switch (shuffleRequest.mode) {
      case 'full':
        // No additional filtering - use all available content
        break
      
      case 'preference':
        // Filter by user preferences (mock implementation)
        filteredContent = filteredContent.filter(item => item.rating >= 8.0)
        break
      
      case 'platform':
        // Already filtered by platforms above
        break
      
      case 'show':
        // Filter to specific show episodes (mock implementation)
        if (shuffleRequest.showId) {
          filteredContent = filteredContent.filter(item => 
            item.type === 'tv' && item.id.toString() === shuffleRequest.showId
          )
        }
        break
      
      case 'list':
        // Filter to user's custom list (mock implementation)
        filteredContent = filteredContent.filter(item => item.rating >= 8.5)
        break
    }

    if (filteredContent.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No content found matching your criteria'
      })
    }

    // Randomly select a recommendation
    const randomIndex = Math.floor(Math.random() * filteredContent.length)
    const recommendation = filteredContent[randomIndex]

    // Get alternatives (excluding the main recommendation)
    const alternatives = filteredContent
      .filter(item => item.id !== recommendation.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    // Generate shuffle ID for tracking
    const shuffleId = `shuffle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return res.status(200).json({
      success: true,
      data: {
        recommendation,
        alternatives,
        shuffleId,
        mode: shuffleRequest.mode
      }
    })

  } catch (error) {
    console.error('Shuffle generation error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to generate shuffle recommendation'
    })
  }
} 