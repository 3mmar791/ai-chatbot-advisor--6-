/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
  // Remove experimental optimizeCss that's causing critters error
  experimental: {
    // Remove optimizeCss
  },
  i18n: {
    locales: ["en", "ar"],
    defaultLocale: "en",
    localeDetection: false,
  },
};

export default nextConfig;
