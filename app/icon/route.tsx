import { generateIcon } from '../icon'
import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const size = parseInt(searchParams.get('size') || '32', 10)
  
  return generateIcon(size)
} 