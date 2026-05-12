'use client'

import { motion } from 'framer-motion'
import { File, Upload, ScanTextIcon, FileStackIcon, Box } from 'lucide-react'

const featuresBtns = [
	{
		icon: File,
		title: 'Generate a document',
		description:
			'Create documents such as Packing Slips from an excel file.'
	},
	{
		icon: Upload,
		title: 'Upload a document',
		description:
			'Upload existing documents to the platform and to your Quickbooks account.'
	},
	{
		icon: ScanTextIcon,
		title: 'Create sheets from pdfs',
		description:
			'Convert PDF documents into editable sheets for easy integration with your workflow.'
	},
	{
		icon: FileStackIcon,
		title: 'Track orders',
		description:
			'Keep track of all your orders, their individual progress and status.'
	},
	{
		icon: Box,
		title: 'Manage inventory',
		description:
			'Keep track of your inventory levels and update them in real-time.'
	}
]

const Home = () => {
	return (
		<main className='bg-secondary text-foreground px-20 h-screen w-full relative'>
			<section className='px-10 py-10'>
				<h1 className='text-2xl font-medium'>
					Hello, <span className='font-bold'>User</span>
				</h1>

				<section className='bg-primary rounded-lg p-6 mt-6 shadow-md'>
					<h2 className='text-xl font-semibold'>Welcome to QBFlow</h2>
					<p className='text-foreground-muted mt-2'>
						Get started by getting familiar with the platform and
						its tools.
					</p>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
						{featuresBtns.map(
							({ icon: Icon, title, description }) => (
								<motion.button
									key={title}
									whileHover={{ scale: 1.05 }}
									transition={{ duration: 0.2 }}
									className='bg-surface hover:bg-surface-hover p-4 rounded-lg flex flex-col items-start gap-2 hover:shadow-md text-left'>
									<Icon
										size={20}
										className='text-foreground-muted'
										aria-hidden='true'
									/>
									<span className='font-semibold text-foreground'>
										{title}
									</span>
									<span className='text-foreground-muted text-sm'>
										{description}
									</span>
								</motion.button>
							)
						)}
					</div>
				</section>
			</section>
		</main>
	)
}

export default Home
