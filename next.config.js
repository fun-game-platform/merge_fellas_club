/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 确保组件导入路径别名正确配置
  webpack(config) {
    return config;
  },
  // 允许将React组件与现有客户端代码一起使用
  transpilePackages: [],
}

export default nextConfig