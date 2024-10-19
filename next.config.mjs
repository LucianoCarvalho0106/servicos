/** @type {import('next').NextConfig} */
const nextConfig = {
 reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**', // Permitir todas as rotas do domínio
      },
    ],
  },
};

export default nextConfig;
