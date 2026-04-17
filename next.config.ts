import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["vtracer-wasm"],
  },
};

export default nextConfig;
