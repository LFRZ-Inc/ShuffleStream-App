/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/ShuffleStream',
  assetPrefix: '/ShuffleStream/',
  trailingSlash: true,
}

module.exports = nextConfig 