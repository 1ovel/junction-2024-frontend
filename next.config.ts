import type { NextConfig } from "next";

    const nextConfig = {
        webpack: (config, { isServer }) => {
          config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
          };
          return config;
        },
      };
      
      export default nextConfig;
