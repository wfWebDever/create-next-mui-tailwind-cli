import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: webpackConfig => {
    webpackConfig.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader'
    })

    return webpackConfig
  }
}

export default nextConfig
