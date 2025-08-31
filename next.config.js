/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
    reactStrictMode: false,
    trailingSlash: true,
    assetPrefix: isProd ? '/Datafields/' : '',
    basePath: isProd ? '/Datafields' : '',
    output: 'export',
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig
