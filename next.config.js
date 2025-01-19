/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  // Suppress hydration warnings from Grammarly
  reactStrictMode: false,
};

module.exports = nextConfig; 