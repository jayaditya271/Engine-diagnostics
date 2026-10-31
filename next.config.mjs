/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbopackPluginRuntimeStrategy: "forceWorkerThreads",
  },
};

export default nextConfig;



