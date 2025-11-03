/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Reduce memory usage during development
  experimental: {
    // Use less memory for compilation
    workerThreads: false,
    cpus: 2, // Limit to 2 cores to prevent overload
  },

  // Optimize images
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    unoptimized: true, // Added to ignore optimized images
  },

  // Reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Faster builds
  swcMinify: true,

  // Ignore ESLint and TypeScript errors during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
