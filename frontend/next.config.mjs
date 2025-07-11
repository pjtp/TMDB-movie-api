/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [new URL("https://image.tmdb.org/t/p/w500/**")],
  },
};

export default nextConfig;
