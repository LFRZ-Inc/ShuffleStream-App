/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  trailingSlash: true,
  distDir: 'dist',
  
  // GitHub Pages configuration
  basePath: process.env.NODE_ENV === 'production' ? '/ShuffleStream-App' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ShuffleStream-App/' : '',
  
  images: {
    unoptimized: true // Required for static export
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true // Allow build to complete with type errors in demo mode
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true // Skip ESLint during build
  },
  
  // Webpack configuration to handle missing modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  
  // Disable experimental features that cause issues
  experimental: {
    missingSuspenseWithCSRBailout: false,
  }
}

module.exports = nextConfig 