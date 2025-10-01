/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "kimi-web-img.moonshot.cn",
      "api.stability.ai",
      "replicate.delivery",
      "huggingface.co",
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Handle ChromaDB client issues
    config.externals = [
      ...(config.externals || []),
      {
        "utf-8-validate": "commonjs utf-8-validate",
        bufferutil: "commonjs bufferutil",
        "supports-color": "commonjs supports-color",
      },
    ];

    // Ignore critical dependencies for ChromaDB
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /chromadb/ },
      {
        message:
          /Critical dependency: the request of a dependency is an expression/,
      },
    ];

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: [
      "@xenova/transformers",
      "sharp",
      "chromadb",
    ],
  },
};

module.exports = nextConfig;
