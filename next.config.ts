import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Spot imagery is seeded from Wikimedia Commons. The host is pinned rather
    // than wildcarded, and must be extended here if the backend starts serving
    // spot photos from anywhere else -- next/image refuses to optimise URLs that
    // do not match a configured pattern.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/**",
      },
    ],
  },
};

export default nextConfig;
