import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: 'standalone',
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
