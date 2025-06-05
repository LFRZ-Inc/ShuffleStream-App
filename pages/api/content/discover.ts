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
  platform?: string
  themed_background?: string
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
  platform?: string
  themed_background?: string
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

// Generate themed background based on genre and title
const generateThemedBackground = (title: string, genres: string[]): string => {
  const colors = {
    'Action': 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
    'Adventure': 'linear-gradient(135deg, #feca57, #ff9ff3)',
    'Animation': 'linear-gradient(135deg, #48dbfb, #0abde3)',
    'Comedy': 'linear-gradient(135deg, #ffeaa7, #fdcb6e)',
    'Crime': 'linear-gradient(135deg, #636e72, #2d3436)',
    'Documentary': 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
    'Drama': 'linear-gradient(135deg, #fd79a8, #e84393)',
    'Family': 'linear-gradient(135deg, #55efc4, #00b894)',
    'Fantasy': 'linear-gradient(135deg, #fd79a8, #fdcb6e)',
    'History': 'linear-gradient(135deg, #e17055, #d63031)',
    'Horror': 'linear-gradient(135deg, #2d3436, #636e72)',
    'Music': 'linear-gradient(135deg, #a29bfe, #74b9ff)',
    'Mystery': 'linear-gradient(135deg, #636e72, #2d3436)',
    'Romance': 'linear-gradient(135deg, #fd79a8, #e84393)',
    'Science Fiction': 'linear-gradient(135deg, #74b9ff, #0984e3)',
    'TV Movie': 'linear-gradient(135deg, #81ecec, #00cec9)',
    'Thriller': 'linear-gradient(135deg, #2d3436, #636e72)',
    'War': 'linear-gradient(135deg, #636e72, #2d3436)',
    'Western': 'linear-gradient(135deg, #e17055, #d63031)'
  }
  
  const primaryGenre = genres[0] || 'Drama'
  return colors[primaryGenre as keyof typeof colors] || 'linear-gradient(135deg, #667eea, #764ba2)'
}

// Expanded mock content library
const createMockContent = () => {
  const mockMovies: TMDBMovie[] = [
    {
      id: 1,
      title: "The Dark Knight",
      overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2008-07-18",
      vote_average: 9.0,
      genre_ids: [28, 80, 18],
      platform: "hbo",
      themed_background: generateThemedBackground("The Dark Knight", ["Action", "Crime", "Drama"])
    },
    {
      id: 2,
      title: "Inception",
      overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2010-07-16",
      vote_average: 8.8,
      genre_ids: [28, 878, 53],
      platform: "netflix",
      themed_background: generateThemedBackground("Inception", ["Action", "Science Fiction", "Thriller"])
    },
    {
      id: 3,
      title: "Dune",
      overview: "Paul Atreides leads nomadic tribes in a revolt against the evil House Harkonnen.",
      poster_path: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      backdrop_path: "/iopYFB1b6Bh7FWZh3onQhph1sih.jpg",
      release_date: "2021-09-15",
      vote_average: 8.0,
      genre_ids: [878, 12, 18],
      platform: "hbo",
      themed_background: generateThemedBackground("Dune", ["Science Fiction", "Adventure", "Drama"])
    },
    {
      id: 4,
      title: "Spider-Man: Into the Spider-Verse",
      overview: "Teen Miles Morales becomes Spider-Man and must save the multiverse from collapse.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2018-12-14",
      vote_average: 8.4,
      genre_ids: [16, 28, 12],
      platform: "netflix",
      themed_background: generateThemedBackground("Spider-Man: Into the Spider-Verse", ["Animation", "Action", "Adventure"])
    },
    {
      id: 5,
      title: "Top Gun: Maverick",
      overview: "After thirty years, Maverick is still pushing the envelope as a top naval aviator.",
      poster_path: "/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
      backdrop_path: null,
      release_date: "2022-05-27",
      vote_average: 8.3,
      genre_ids: [28, 18],
      platform: "paramount",
      themed_background: generateThemedBackground("Top Gun: Maverick", ["Action", "Drama"])
    },
    {
      id: 6,
      title: "Everything Everywhere All at Once",
      overview: "A Chinese-American woman gets swept up in an insane adventure where she alone can save existence.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2022-03-25",
      vote_average: 8.1,
      genre_ids: [28, 12, 35],
      platform: "prime",
      themed_background: generateThemedBackground("Everything Everywhere All at Once", ["Action", "Adventure", "Comedy"])
    },
    {
      id: 7,
      title: "The Batman",
      overview: "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2022-03-04",
      vote_average: 7.8,
      genre_ids: [80, 9648, 53],
      platform: "hbo",
      themed_background: generateThemedBackground("The Batman", ["Crime", "Mystery", "Thriller"])
    },
    {
      id: 8,
      title: "Avatar: The Way of Water",
      overview: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2022-12-16",
      vote_average: 7.6,
      genre_ids: [878, 12, 10751],
      platform: "disney",
      themed_background: generateThemedBackground("Avatar: The Way of Water", ["Science Fiction", "Adventure", "Family"])
    },
    {
      id: 9,
      title: "Black Panther: Wakanda Forever",
      overview: "The people of Wakanda fight to protect their home from intervening world powers.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2022-11-11",
      vote_average: 7.3,
      genre_ids: [28, 12, 18],
      platform: "disney",
      themed_background: generateThemedBackground("Black Panther: Wakanda Forever", ["Action", "Adventure", "Drama"])
    },
    {
      id: 10,
      title: "Glass Onion: A Knives Out Mystery",
      overview: "Detective Benoit Blanc travels to Greece to peel back the layers of a mystery involving a new cast of suspects.",
      poster_path: null,
      backdrop_path: null,
      release_date: "2022-12-23",
      vote_average: 7.2,
      genre_ids: [35, 80, 9648],
      platform: "netflix",
      themed_background: generateThemedBackground("Glass Onion: A Knives Out Mystery", ["Comedy", "Crime", "Mystery"])
    }
  ]

  const mockTVShows: TMDBTVShow[] = [
    {
      id: 11,
      name: "Stranger Things",
      overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments.",
      poster_path: "/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
      backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
      first_air_date: "2016-07-15",
      vote_average: 8.7,
      genre_ids: [18, 9648, 10765],
      platform: "netflix",
      themed_background: generateThemedBackground("Stranger Things", ["Drama", "Mystery", "Sci-Fi"])
    },
    {
      id: 12,
      name: "The Mandalorian",
      overview: "The travels of a lone bounty hunter in the outer reaches of the galaxy.",
      poster_path: "/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg",
      backdrop_path: "/9ijMGlJKqcslswWUzTEwScm82Gs.jpg",
      first_air_date: "2019-11-12",
      vote_average: 8.7,
      genre_ids: [10765, 37, 18],
      platform: "disney",
      themed_background: generateThemedBackground("The Mandalorian", ["Sci-Fi", "Western", "Drama"])
    },
    {
      id: 13,
      name: "The Bear",
      overview: "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop.",
      poster_path: "/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg",
      backdrop_path: null,
      first_air_date: "2022-06-23",
      vote_average: 8.7,
      genre_ids: [35, 18],
      platform: "hulu",
      themed_background: generateThemedBackground("The Bear", ["Comedy", "Drama"])
    },
    {
      id: 14,
      name: "Wednesday",
      overview: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree.",
      poster_path: "/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
      backdrop_path: "/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg",
      first_air_date: "2022-11-23",
      vote_average: 8.8,
      genre_ids: [35, 80, 9648],
      platform: "netflix",
      themed_background: generateThemedBackground("Wednesday", ["Comedy", "Crime", "Mystery"])
    },
    {
      id: 15,
      name: "House of the Dragon",
      overview: "The Targaryen civil war, known as the Dance of the Dragons, tore apart the Seven Kingdoms.",
      poster_path: null,
      backdrop_path: null,
      first_air_date: "2022-08-21",
      vote_average: 8.4,
      genre_ids: [10759, 18, 10765],
      platform: "hbo",
      themed_background: generateThemedBackground("House of the Dragon", ["Action", "Drama", "Fantasy"])
    },
    {
      id: 16,
      name: "The Last of Us",
      overview: "After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl.",
      poster_path: null,
      backdrop_path: null,
      first_air_date: "2023-01-15",
      vote_average: 8.8,
      genre_ids: [18, 10765, 10759],
      platform: "hbo",
      themed_background: generateThemedBackground("The Last of Us", ["Drama", "Sci-Fi", "Action"])
    },
    {
      id: 17,
      name: "Abbott Elementary",
      overview: "A workplace mockumentary about the daily lives of teachers in an underfunded Philadelphia elementary school.",
      poster_path: null,
      backdrop_path: null,
      first_air_date: "2021-12-07",
      vote_average: 8.0,
      genre_ids: [35],
      platform: "hulu",
      themed_background: generateThemedBackground("Abbott Elementary", ["Comedy"])
    },
    {
      id: 18,
      name: "The White Lotus",
      overview: "Social satire set at an exclusive Hawaiian resort.",
      poster_path: null,
      backdrop_path: null,
      first_air_date: "2021-07-11",
      vote_average: 7.9,
      genre_ids: [35, 18, 9648],
      platform: "hbo",
      themed_background: generateThemedBackground("The White Lotus", ["Comedy", "Drama", "Mystery"])
    },
    {
      id: 19,
      name: "Euphoria",
      overview: "A group of high school students navigate love and friendships in a world of drugs, sex, trauma and social media.",
      poster_path: null,
      backdrop_path: null,
      first_air_date: "2019-06-16",
      vote_average: 8.4,
      genre_ids: [18],
      platform: "hbo",
      themed_background: generateThemedBackground("Euphoria", ["Drama"])
    },
    {
      id: 20,
      name: "Only Murders in the Building",
      overview: "Three strangers who share an obsession with true crime podcasts suddenly find themselves wrapped up in one.",
      poster_path: null,
      backdrop_path: null,
      first_air_date: "2021-08-31",
      vote_average: 8.1,
      genre_ids: [35, 80, 9648],
      platform: "hulu",
      themed_background: generateThemedBackground("Only Murders in the Building", ["Comedy", "Crime", "Mystery"])
    }
  ]

  return { mockMovies, mockTVShows }
}

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
      sort_by = 'popularity.desc',
      search = ''
    } = req.query

    // If no API key, return enhanced mock data
    if (TMDB_API_KEY === 'demo_key') {
      const { mockMovies, mockTVShows } = createMockContent()
      
      let filteredMovies = mockMovies
      let filteredTVShows = mockTVShows

      // Apply search filter
      if (search && typeof search === 'string') {
        const searchTerm = search.toLowerCase()
        filteredMovies = filteredMovies.filter(movie => 
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.overview.toLowerCase().includes(searchTerm)
        )
        filteredTVShows = filteredTVShows.filter(show => 
          show.name.toLowerCase().includes(searchTerm) ||
          show.overview.toLowerCase().includes(searchTerm)
        )
      }

      // Apply platform filter
      if (platform && typeof platform === 'string') {
        filteredMovies = filteredMovies.filter(movie => movie.platform === platform)
        filteredTVShows = filteredTVShows.filter(show => show.platform === platform)
      }

      // Apply genre filter (simplified for demo)
      if (genre && typeof genre === 'string') {
        const genreMap: { [key: string]: number[] } = {
          'action': [28],
          'comedy': [35],
          'drama': [18],
          'horror': [27],
          'sci-fi': [878, 10765],
          'thriller': [53],
          'animation': [16],
          'crime': [80],
          'mystery': [9648]
        }
        const genreIds = genreMap[genre.toLowerCase()] || []
        if (genreIds.length > 0) {
          filteredMovies = filteredMovies.filter(movie => 
            movie.genre_ids.some(id => genreIds.includes(id))
          )
          filteredTVShows = filteredTVShows.filter(show => 
            show.genre_ids.some(id => genreIds.includes(id))
          )
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          movies: type === 'tv' ? [] : filteredMovies,
          tvShows: type === 'movie' ? [] : filteredTVShows,
          totalResults: type === 'tv' ? filteredTVShows.length : 
                       type === 'movie' ? filteredMovies.length : 
                       filteredMovies.length + filteredTVShows.length
        }
      })
    }

    // Real TMDB API calls (when API key is provided)
    const promises = []
    
    if (type === 'all' || type === 'movie') {
      let movieUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${page}&sort_by=${sort_by}`
      if (genre) movieUrl += `&with_genres=${genre}`
      promises.push(fetch(movieUrl).then(res => res.json()))
    }
    
    if (type === 'all' || type === 'tv') {
      let tvUrl = `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&page=${page}&sort_by=${sort_by}`
      if (genre) tvUrl += `&with_genres=${genre}`
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