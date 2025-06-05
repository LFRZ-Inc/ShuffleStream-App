/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable export for production builds (GitHub Pages)
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
    ],
  },
  // Only use basePath for GitHub Pages deployment
  basePath: process.env.GITHUB_ACTIONS ? '/ShuffleStream' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/ShuffleStream/' : '',
  trailingSlash: true,
  reactStrictMode: true,
}

module.exports = nextConfig 