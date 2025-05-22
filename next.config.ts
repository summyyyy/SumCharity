import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/SumCharity",
  assetPrefix: "/SumCharity/",
  output: "export",
  images: {
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
