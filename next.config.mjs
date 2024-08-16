/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/parse/:path*',
        destination: 'http://52.83.46.103:32731/:path*'
      },
    ]
  }
};

export default nextConfig;
