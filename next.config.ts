import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Use standalone only for Docker builds, not Vercel
  ...(process.env.DOCKER_BUILD === "true" && { output: "standalone" }),
};

export default nextConfig;
