import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Ignore warnings from Genkit AI dependencies
    config.ignoreWarnings = [
      /Can't resolve '@opentelemetry\/exporter-jaeger'/,
      /require\.extensions is not supported by webpack/,
    ];
    
    // Configure externals for server-side rendering
    if (isServer) {
      config.externals = [...(config.externals || []), 'handlebars'];
    }
    
    return config;
  },
};

export default nextConfig;
