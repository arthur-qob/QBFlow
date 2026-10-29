import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/:path*`
			},
			{
				source: '/generate',
				destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/generate`
			},
			{
				source: '/generate-invoice',
				destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/generate-invoice`
			}
		]
	}
}

export default nextConfig
