// First check environment variables
console.log('Checking environment variables...')
console.log('TMDB API Key:', process.env.NEXT_PUBLIC_TMDB_API_KEY ? 'Present' : 'Missing')
console.log('Streaming API Key:', process.env.NEXT_PUBLIC_STREAMING_API_KEY ? 'Present' : 'Missing')

import { tmdb } from './lib/tmdb'
import { searchContent } from './lib/streaming'

async function testAPIs() {
  try {
    // Test TMDB API
    console.log('\nTesting TMDB API...')
    const trendingResults = await tmdb.getTrending()
    console.log('TMDB API working! Found', trendingResults.results.length, 'trending items')

    // Test Streaming Availability API
    console.log('\nTesting Streaming Availability API...')
    const streamingResults = await searchContent({
      type: 'movie',
      page: 1
    })
    console.log('Streaming API working! Found', streamingResults.length, 'items')

  } catch (error) {
    console.error('Error testing APIs:', error)
  }
}

testAPIs() 