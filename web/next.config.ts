import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Tudo que começar com /api/ vai para o seu Render
        source: "/api/:path*",
        destination: `${process.env.API_URL}/:path*`, 
      },
    ];
  },
};

export default nextConfig;