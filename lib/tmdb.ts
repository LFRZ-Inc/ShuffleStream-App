import { Content, PlatformType } from '@/types'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export interface TMDBProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface TMDBStreamingInfo {
  provider_id: number;
  provider_name: string;
  type: 'flatrate' | 'free' | 'ads' | 'rent' | 'buy';
  quality?: 'HD' | '4K';
}

export interface TMDBTitle {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  media_type: 'movie' | 'tv';
  genre_ids: number[];
  first_air_date?: string;
  release_date?: string;
  vote_average: number;
  streaming_info?: TMDBStreamingInfo[];
}

export interface TMDBEpisode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
  episode_number: number;
  season_number: number;
  air_date: string;
}

interface TMDBResponse<T> {
  results: T[];
}

class TMDBClient {
  private async fetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
    url.searchParams.append('api_key', TMDB_API_KEY || '')
    
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, value)
    }
    
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`)
    }
    
    return response.json() as Promise<T>
  }
  
  // Get streaming providers for a region
  async getProviders(region: string = 'US'): Promise<TMDBProvider[]> {
    const data = await this.fetch<TMDBResponse<TMDBProvider>>('/watch/providers/movie')
    return data.results
  }
  
  // Get streaming availability for a title
  async getStreamingInfo(tmdbId: number, type: 'movie' | 'tv', region: string = 'US') {
    const data = await this.fetch<{ results: Record<string, any> }>(`/${type}/${tmdbId}/watch/providers`)
    return data.results?.[region] || null
  }
  
  // Search across movies and TV shows
  async search(query: string, page: number = 1) {
    return this.fetch<TMDBResponse<TMDBTitle>>('/search/multi', {
      query,
      page: page.toString(),
      include_adult: 'false'
    })
  }
  
  // Get popular content
  async getPopular(type: 'movie' | 'tv' = 'movie', page: number = 1) {
    return this.fetch<TMDBResponse<TMDBTitle>>(`/${type}/popular`, {
      page: page.toString()
    })
  }
  
  // Get trending content
  async getTrending(timeWindow: 'day' | 'week' = 'week') {
    return this.fetch<TMDBResponse<TMDBTitle>>(`/trending/all/${timeWindow}`)
  }
  
  // Get TV show episodes
  async getEpisodes(showId: number, seasonNumber: number) {
    return this.fetch<{ episodes: TMDBEpisode[] }>(
      `/tv/${showId}/season/${seasonNumber}`
    )
  }
  
  // Convert TMDB data to our Content type
  async convertToContent(tmdbTitle: TMDBTitle): Promise<Content> {
    // Get streaming info
    const streamingInfo = await this.getStreamingInfo(
      tmdbTitle.id,
      tmdbTitle.media_type
    )
    
    // Map TMDB provider IDs to our platform types
    const platformMap: Record<number, PlatformType> = {
      8: 'netflix',
      337: 'disney+',
      15: 'hulu',
      9: 'prime',
      384: 'hbo',
      350: 'apple',
      531: 'paramount',
      386: 'peacock'
    }
    
    // Find the first available platform
    const platformId = streamingInfo?.flatrate?.[0]?.provider_id
    const mappedPlatform = platformId ? platformMap[platformId] : undefined
    
    if (!mappedPlatform) {
      throw new Error('No supported streaming platform found')
    }
    
    return {
      id: tmdbTitle.id.toString(),
      title: tmdbTitle.title || tmdbTitle.name || '',
      type: tmdbTitle.media_type === 'movie' ? 'movie' : 'series',
      platformId: mappedPlatform,
      genres: [], // Would need to map TMDB genre IDs to our genres
      releaseYear: new Date(
        tmdbTitle.release_date || tmdbTitle.first_air_date || ''
      ).getFullYear(),
      rating: tmdbTitle.vote_average.toString(),
      duration: 0, // Would need additional API call to get duration
      deepLinkUrl: '', // Would need to construct based on platform
      thumbnailUrl: `https://image.tmdb.org/t/p/w500${tmdbTitle.poster_path}`,
      description: tmdbTitle.overview
    }
  }
}

export const tmdb = new TMDBClient() 