// Simple test script to verify API functionality
const testAPIs = async () => {
  const baseUrl = 'http://localhost:3000'
  
  console.log('🧪 Testing ShuffleStream APIs...\n')
  
  // Test 1: Content Discovery API
  console.log('1️⃣ Testing Content Discovery API...')
  try {
    const response = await fetch(`${baseUrl}/api/content/discover?type=all&platform=netflix`)
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ Content Discovery API working')
      console.log(`   Found ${data.data.totalResults} items`)
      
      // Check for themed backgrounds
      const allContent = [...(data.data.movies || []), ...(data.data.tvShows || [])]
      const itemsWithThemedBg = allContent.filter(item => item.themed_background)
      console.log(`   ${itemsWithThemedBg.length} items have themed backgrounds`)
      
      if (itemsWithThemedBg.length > 0) {
        console.log(`   Example themed background: ${itemsWithThemedBg[0].themed_background}`)
      }
    } else {
      console.log('❌ Content Discovery API failed:', data.error)
    }
  } catch (error) {
    console.log('❌ Content Discovery API error:', error.message)
  }
  
  console.log('')
  
  // Test 2: Shuffle Generation API
  console.log('2️⃣ Testing Shuffle Generation API...')
  try {
    const shuffleRequest = {
      mode: 'full',
      platforms: ['netflix', 'hbo'],
      genres: ['Action', 'Drama'],
      contentType: 'all'
    }
    
    const response = await fetch(`${baseUrl}/api/shuffle/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shuffleRequest),
    })
    
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ Shuffle Generation API working')
      console.log(`   Recommendation: ${data.data.recommendation.title}`)
      console.log(`   Platform: ${data.data.recommendation.platform}`)
      console.log(`   Rating: ${data.data.recommendation.rating}/10`)
      console.log(`   Alternatives: ${data.data.alternatives.length}`)
      
      if (data.data.recommendation.themed_background) {
        console.log(`   Has themed background: Yes`)
      }
    } else {
      console.log('❌ Shuffle Generation API failed:', data.error)
    }
  } catch (error) {
    console.log('❌ Shuffle Generation API error:', error.message)
  }
  
  console.log('')
  
  // Test 3: Deep Link Generation API
  console.log('3️⃣ Testing Deep Link Generation API...')
  try {
    const response = await fetch(`${baseUrl}/api/deeplink/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentId: '1',
        platform: 'netflix',
        contentType: 'movie'
      }),
    })
    
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ Deep Link Generation API working')
      console.log(`   App URL: ${data.data.appUrl}`)
      console.log(`   Web URL: ${data.data.webUrl}`)
    } else {
      console.log('❌ Deep Link Generation API failed:', data.error)
    }
  } catch (error) {
    console.log('❌ Deep Link Generation API error:', error.message)
  }
  
  console.log('\n🎉 API testing complete!')
}

// Run the tests
testAPIs().catch(console.error) 