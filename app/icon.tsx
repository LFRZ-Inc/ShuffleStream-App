import { ImageResponse } from 'next/og'
import { SVGProps } from 'react'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export function ShuffleStreamIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      {...props}
    >
      <circle cx="16" cy="16" r="16" fill="url(#gradient)" />
      <path
        d="M10 12L14 16L10 20M18 12L22 16L18 20"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="gradient"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#D946EF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export const iconConfig = {
  icon: [
    { url: '/icon', sizes: '32x32', type: 'image/png' },
  ],
}

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0EA5E9, #D946EF)',
        }}
      >
        <div style={{ marginTop: -2 }}>SS</div>
      </div>
    ),
    {
      ...size,
    }
  )
} 