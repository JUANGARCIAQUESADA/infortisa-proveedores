import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      // Redirige .com → .es (dominio canónico)
      {
        source: "/:path*",
        has: [{ type: "host", value: "llevateunchollo.com" }],
        destination: "https://www.llevateunchollo.es/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.llevateunchollo.com" }],
        destination: "https://www.llevateunchollo.es/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
