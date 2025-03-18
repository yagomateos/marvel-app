/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.annihil.us', 'gateway.marvel.com', 'www.dragonball-api.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Enable production mode optimizations
  env: {
    NODE_ENV: process.env.NODE_ENV,
  },
  // Configure build optimization
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig

