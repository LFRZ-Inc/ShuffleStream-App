import type { NextApiRequest, NextApiResponse } from 'next'

interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  genre_ids: number[]
}

interface TMDBTVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  genre_ids: number[]
}

interface DiscoverResponse {
  success: boolean
  data?: {
    movies: TMDBMovie[]
    tvShows: TMDBTVShow[]
    totalResults: number
  }
  error?: string
}

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'demo_key'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DiscoverResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const { 
      genre, 
      platform, 
      type = 'all', 
      page = 1,
      sort_by = 'popularity.desc'
    } = req.query

    // If no API key, return mock data
    if (TMDB_API_KEY === 'demo_key') {
      const mockMovies: TMDBMovie[] = [
        {
          id: 1,
          title: "Stranger Things",
          overview: "A group of young friends in Hawkins, Indiana, encounter supernatural forces and government conspiracies.",
          poster_path: "/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
          backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
          release_date: "2016-07-15",
          vote_average: 8.7,
          genre_ids: [18, 9648, 10765]
        },
        {
          id: 2,
          title: "The Witcher",
          overview: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
          poster_path: "/7vjaCdMw15FEbXyLQTVa04URsPm.jpg",
          backdrop_path: "/1R6cvRtZgsYCkh8UFuWFN33xBP4.jpg",
          release_date: "2019-12-20",
          vote_average: 8.2,
          genre_ids: [18, 10759, 10765]
        },
        {
          id: 3,
          title: "Dune",
          overview: "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding.",
          poster_path: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
          backdrop_path: "/iopYFB1b6Bh7FWZh3onQhph1sih.jpg",
          release_date: "2021-09-15",
          vote_average: 8.0,
          genre_ids: [878, 12, 18]
        }
      ]

      const mockTVShows: TMDBTVShow[] = [
        {
          id: 4,
          name: "The Mandalorian",
          overview: "The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.",
          poster_path: "/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
          backdrop_path: "/9ijMGlJKqcslswWUzTEwScm82Gs.jpg",
          first_air_date: "2019-11-12",
          vote_average: 8.7,
          genre_ids: [10765, 37, 18]
        },
        {
          id: 5,
          name: "Wednesday",
          overview: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends at Nevermore Academy.",
          poster_path: "/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
          backdrop_path: "/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
          first_air_date: "2022-11-23",
          vote_average: 8.8,
          genre_ids: [35, 80, 9648]
        }
      ]

      return res.status(200).json({
        success: true,
        data: {
          movies: type === 'tv' ? [] : mockMovies,
          tvShows: type === 'movie' ? [] : mockTVShows,
          totalResults: type === 'tv' ? mockTVShows.length : type === 'movie' ? mockMovies.length : mockMovies.length + mockTVShows.length
        }
      })
    }

    // Real TMDB API calls
    const promises = []
    
    if (type === 'all' || type === 'movie') {
      const movieUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&sort_by=${sort_by}`
      promises.push(fetch(movieUrl).then(res => res.json()))
    }
    
    if (type === 'all' || type === 'tv') {
      const tvUrl = `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&page=${page}&sort_by=${sort_by}`
      promises.push(fetch(tvUrl).then(res => res.json()))
    }

    const results = await Promise.all(promises)
    
    const movies = type === 'tv' ? [] : (results[0]?.results || [])
    const tvShows = type === 'movie' ? [] : (results[type === 'all' ? 1 : 0]?.results || [])

    return res.status(200).json({
      success: true,
      data: {
        movies,
        tvShows,
        totalResults: movies.length + tvShows.length
      }
    })

  } catch (error) {
    console.error('Content discovery error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch content'
    })
  }
} 