module.exports = {
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/login",
      },
    ];
  },
};
