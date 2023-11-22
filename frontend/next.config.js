/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: '/',
                destination: '/home',
                permanent: true,
            },
        ]
    },
    async rewrites() {
        return [
            {
                source: '/project/:path*',
                destination: process.env.NEXT_PUBLIC_SERVER_URL+'/:path*' // Proxy to Backend
            }
        ]
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        backendUrl: process.env.NEXT_PUBLIC_SERVER_URL,
    },
}

module.exports = nextConfig
