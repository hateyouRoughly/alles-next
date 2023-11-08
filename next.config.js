/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: 'https://www.etsy.com/shop/libaasbyanam',
                permanent: false
            },
            {
                source: '/:localization/listing/:sku/:slug',
                destination: 'https://www.etsy.com/:localization/listing/:sku/:slug',
                permanent: false
            },
            /*
            {
                source: '/:path((?!google2584666487d3aaee.html$).*)',
                destination: 'https://www.etsy.com/api/:path*',
                permanent: false
            }
            */
        ]
      },
    async rewrites() {
        return {
            beforeFiles: [
                /*
                {
                    source: "/",
                    destination: 'https://www.etsy.com/shop/libaasbyanam'
                },
                {
                    source: '/:localization/listing/:sku/:slug',
                    destination: 'https://www.etsy.com/:localization/listing/:sku/:slug'
                },
                {
                    source: '/api/:path*',
                    destination: 'https://www.etsy.com/api/:path*'
                },
                {
                    source: '/:path*',
                    destination: 'https://www.etsy.com/:path*'
                }
                */
            ]
        }
    }
}

module.exports = nextConfig
