import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import "@/env";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: false,
  transpilePackages: ["next-mdx-remote"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    authInterrupts: true,
  },
};

export default withNextIntl(nextConfig);
