/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist',
  
  // GitHub Pages serves from subdirectory, so we need basePath
  basePath: process.env.NODE_ENV === 'production' ? '/ShuffleStream-App' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ShuffleStream-App/' : '',
  
  images: {
    unoptimized: true // Required for static export
  },
  
  // Disable server-side features not supported in static export
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
}

module.exports = nextConfig 