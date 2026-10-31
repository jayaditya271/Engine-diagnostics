/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  experimental: {
    turbopackPluginRuntimeStrategy: "forceWorkerThreads",
  },
};

export default nextConfig;
