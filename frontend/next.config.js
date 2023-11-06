/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/home',
                permanent: true,
            },
        ]
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        backendUrl: process.env.NEXT_PUBLIC_SERVER_URL,
    },
}

module.exports = nextConfig
