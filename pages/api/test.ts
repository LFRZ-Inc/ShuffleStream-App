import { NextApiRequest, NextApiResponse } from 'next'
import { tmdb } from '@/lib/tmdb'
import { searchContent } from '@/lib/streaming'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check environment variables
    const envCheck = {
      tmdbKey: process.env.NEXT_PUBLIC_TMDB_API_KEY ? 'Present' : 'Missing',
      streamingKey: process.env.NEXT_PUBLIC_STREAMING_API_KEY ? 'Present' : 'Missing'
    }
    
    console.log('Environment variables:', envCheck)

    // Test TMDB API
    const trendingResults = await tmdb.getTrending()
    
    // Test Streaming API
    const streamingResults = await searchContent({
      type: 'movie',
      page: 1
    })

    res.status(200).json({
      success: true,
      envCheck,
      tmdbResults: trendingResults.results.length,
      streamingResults: streamingResults.length
    })
  } catch (error) {
    console.error('API Test Error:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
} 