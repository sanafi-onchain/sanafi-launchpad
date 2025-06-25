import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'standalone',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'wsrv.nl',
      'pub-85c7f5f0dc104dc784e656b623d999e5.r2.dev',
      'i.imgur.com',
      'gateway.irys.xyz',
    ],
  },
};

export default nextConfig;
