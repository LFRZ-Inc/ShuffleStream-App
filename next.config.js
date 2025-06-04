/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
    ],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/ShuffleStream' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ShuffleStream/' : '',
  trailingSlash: true,
  reactStrictMode: true,
  distDir: 'out',
}

module.exports = nextConfig 