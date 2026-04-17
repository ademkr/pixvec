import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["vtracer-wasm"],
};

export default nextConfig;
