/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: ["sequelize", "sequelize-typescript"],
  },
};

export default nextConfig;
