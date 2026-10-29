'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { File, ScanTextIcon, Building2, Factory, ShoppingCart, Users } from 'lucide-react'
import { useUser } from '@/app/contexts/userContext'

const featuresBtns = [
	{
		icon: File,
		title: 'Document Generator',
		description: 'Create professional Packing Slips and Invoices from Excel templates.',
		href: '/document-generator'
	},
	{
		icon: ScanTextIcon,
		title: 'PDF to Excel Converter',
		description: 'Extract items, quantities, lots and dates from supplier invoice PDFs.',
		href: '/document-scanner'
	},
	{
		icon: Building2,
		title: 'Clients Management',
		description: 'Manage client accounts, logos, addresses and custom brand colors.',
		href: '/clients'
	},
	{
		icon: Factory,
		title: 'Vendors Management',
		description: 'Maintain vendor databases and contact directories.',
		href: '/vendors'
	},
	{
		icon: ShoppingCart,
		title: 'Buyers Directory',
		description: 'Manage purchasing entities, shipping addresses and tax IDs.',
		href: '/buyers'
	},
	{
		icon: Users,
		title: 'User Management',
		description: 'View registered platform members and manage profile accounts.',
		href: '/users'
	}
]

const Home = () => {
	const { appUser } = useUser()
	const userName = appUser?.first_name || 'User'

	return (
		<main className='bg-secondary text-foreground pl-24 pr-10 py-10 min-h-screen w-full relative'>
			<section className='max-w-6xl mx-auto'>
				<h1 className='text-2xl font-medium'>
					Hello, <span className='font-bold'>{userName}</span>
				</h1>

				<section className='bg-primary rounded-xl p-8 mt-6 shadow-sm border border-secondary'>
					<h2 className='text-xl font-bold'>Welcome to QBFlow</h2>
					<p className='text-foreground-muted mt-2 text-sm max-w-2xl'>
						Your automated operations and document generation platform. Generate export packing slips, convert PDF invoices into editable spreadsheets, and manage your clients, vendors, buyers and team.
					</p>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8'>
						{featuresBtns.map(
							({ icon: Icon, title, description, href }) => (
								<Link key={title} href={href}>
									<motion.div
										whileHover={{ scale: 1.02 }}
										transition={{ duration: 0.2 }}
										className='bg-surface hover:bg-surface-hover p-5 rounded-xl flex flex-col items-start gap-2.5 hover:shadow-md text-left border border-secondary transition-colors h-full cursor-pointer'>
										<div className='p-2 bg-emerald-500/10 text-emerald-400 rounded-lg'>
											<Icon size={22} aria-hidden='true' />
										</div>
										<span className='font-semibold text-foreground mt-1'>
											{title}
										</span>
										<span className='text-foreground-muted text-xs leading-relaxed'>
											{description}
										</span>
									</motion.div>
								</Link>
							)
						)}
					</div>
				</section>
			</section>
		</main>
	)
}

export default Home
