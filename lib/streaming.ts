import { Content, PlatformType, Genre, ContentType } from '@/types'

const STREAMING_API_KEY = process.env.NEXT_PUBLIC_STREAMING_API_KEY
const STREAMING_API_URL = 'https://streaming-availability.p.rapidapi.com'

export interface StreamingResult {
  type: 'movie' | 'series'
  title: string
  overview: string
  imdbId: string
  posterURLs: {
    '92': string
    '154': string
    '185': string
    '342': string
    '500': string
    '780': string
    original: string
  }
  streamingInfo: {
    [country: string]: {
      [service: string]: {
        link: string
        quality: string
        leaving: number
        availableSince: number
      }[]
    }
  }
  cast: string[]
  year: number
  advisedMinimumAudienceAge: number
  imdbRating: number
  genres: string[]
  originalLanguage: string
  countries: string[]
  runtime: number
  significants: string[]
}

export interface SearchParams {
  country?: string
  services?: PlatformType[]
  type?: 'movie' | 'series' | 'all'
  genre?: string
  page?: number
  language?: string
  output_language?: string
  order_by?: 'year' | 'rating' | 'popularity_percent'
  desc?: boolean
  min_imdb_rating?: number
  max_imdb_rating?: number
  min_year?: number
  max_year?: number
  keyword?: string
}

const genreMap: Record<string, Genre> = {
  'action': { id: 'action', name: 'Action', icon: '💥' },
  'adventure': { id: 'adventure', name: 'Adventure', icon: '🗺️' },
  'animation': { id: 'animation', name: 'Animation', icon: '🎨' },
  'comedy': { id: 'comedy', name: 'Comedy', icon: '😂' },
  'crime': { id: 'crime', name: 'Crime', icon: '🔍' },
  'documentary': { id: 'documentary', name: 'Documentary', icon: '📹' },
  'drama': { id: 'drama', name: 'Drama', icon: '🎭' },
  'family': { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' },
  'fantasy': { id: 'fantasy', name: 'Fantasy', icon: '🧙‍♂️' },
  'history': { id: 'history', name: 'History', icon: '📜' },
  'horror': { id: 'horror', name: 'Horror', icon: '👻' },
  'music': { id: 'music', name: 'Music', icon: '🎵' },
  'mystery': { id: 'mystery', name: 'Mystery', icon: '🔎' },
  'romance': { id: 'romance', name: 'Romance', icon: '💕' },
  'science-fiction': { id: 'sci-fi', name: 'Science Fiction', icon: '🚀' },
  'thriller': { id: 'thriller', name: 'Thriller', icon: '😰' },
  'war': { id: 'war', name: 'War', icon: '⚔️' },
  'western': { id: 'western', name: 'Western', icon: '🤠' }
}

function mapContentType(type: 'movie' | 'series'): ContentType {
  return type === 'movie' ? 'movie' : 'series'
}

export async function searchContent(params: SearchParams): Promise<Content[]> {
  const queryParams = new URLSearchParams({
    country: params.country || 'us',
    services: params.services?.join(',') || 'netflix,prime,disney,hulu,hbo,apple,paramount,peacock',
    type: params.type || 'all',
    order_by: params.order_by || 'popularity_percent',
    desc: params.desc?.toString() || 'true',
    page: params.page?.toString() || '1',
    ...(params.genre && { genre: params.genre }),
    ...(params.keyword && { keyword: params.keyword }),
    ...(params.min_imdb_rating && { min_imdb_rating: params.min_imdb_rating.toString() }),
    ...(params.max_imdb_rating && { max_imdb_rating: params.max_imdb_rating.toString() }),
    ...(params.min_year && { min_year: params.min_year.toString() }),
    ...(params.max_year && { max_year: params.max_year.toString() })
  })

  const response = await fetch(`${STREAMING_API_URL}/search/basic?${queryParams}`, {
    headers: {
      'X-RapidAPI-Key': STREAMING_API_KEY!,
      'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch streaming data')
  }

  const data = await response.json()
  
  return data.results.map((result: StreamingResult) => {
    const streamingInfo = result.streamingInfo?.us || {}
    const [platform, info] = Object.entries(streamingInfo)[0] || []

    return {
      id: result.imdbId,
      title: result.title,
      type: mapContentType(result.type),
      platformId: platform as PlatformType,
      genres: result.genres.map(g => genreMap[g.toLowerCase()] || { id: 'other', name: 'Other', icon: '❓' }),
      releaseYear: result.year,
      rating: result.imdbRating.toString(),
      duration: result.runtime,
      deepLinkUrl: info?.[0]?.link || '',
      thumbnailUrl: result.posterURLs?.['342'] || result.posterURLs?.original,
      description: result.overview
    }
  })
}

export async function getContentDetails(id: string): Promise<Content> {
  const response = await fetch(`${STREAMING_API_URL}/get/basic/${id}`, {
    headers: {
      'X-RapidAPI-Key': STREAMING_API_KEY!,
      'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch content details')
  }

  const result: StreamingResult = await response.json()
  const streamingInfo = result.streamingInfo?.us || {}
  const [platform, info] = Object.entries(streamingInfo)[0] || []

  return {
    id: result.imdbId,
    title: result.title,
    type: mapContentType(result.type),
    platformId: platform as PlatformType,
    genres: result.genres.map(g => genreMap[g.toLowerCase()] || { id: 'other', name: 'Other', icon: '❓' }),
    releaseYear: result.year,
    rating: result.imdbRating.toString(),
    duration: result.runtime,
    deepLinkUrl: info?.[0]?.link || '',
    thumbnailUrl: result.posterURLs?.['342'] || result.posterURLs?.original,
    description: result.overview
  }
} 