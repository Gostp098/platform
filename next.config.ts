import type { NextConfig } from "next";

const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig