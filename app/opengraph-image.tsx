import { ImageResponse } from 'next/og'
import { ShuffleStreamIcon } from './icon'

export const runtime = 'edge'

export const alt = 'ShuffleStream - Smart Streaming Assistant'
export const size = {
  width: 1200,
  height: 630,
}

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, rgb(14, 165, 233), rgb(217, 70, 239))',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter',
          color: 'white',
          padding: 80,
          gap: 32,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <ShuffleStreamIcon width={120} height={120} />
          <h1 style={{ fontSize: 80, fontWeight: 800, margin: 0 }}>
            ShuffleStream
          </h1>
        </div>
        <p style={{ fontSize: 32, opacity: 0.9, textAlign: 'center', margin: 0, maxWidth: 800 }}>
          Your smarter way to stream. Connect all your platforms, discover content with advanced shuffle features.
        </p>
      </div>
    ),
    {
      ...size,
    }
  )
} 