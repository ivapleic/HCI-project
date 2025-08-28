import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.pravatar.cc','m.media-amazon.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
