/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Next.js 15 experimental features
    serverActions: true,
    serverComponents: true,
  },
    images: {
        domains: ['lh3.googleusercontent.com'], // <-- Add external image domain(s) here
      },
};

export default nextConfig;
