'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import MenuButton from './menuButton'
import ThemeToggler from './themeToggler'
import { Box, File, FileStackIcon, ScanTextIcon, Upload } from 'lucide-react'
import Link from 'next/link'

const NAV_ITEMS = [
	{ icon: File, label: 'Document Generator', path: '/document-generator' },
	{ icon: Upload, label: 'Document Upload', path: '/document-upload' },
	{
		icon: ScanTextIcon,
		label: 'Document Scanner',
		path: '/document-scanner'
	},
	{ icon: FileStackIcon, label: 'Orders', path: '/orders' },
	{ icon: Box, label: 'Inventory', path: '/inventory' }
]

const SideBar = () => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<>
			<motion.div
				animate={{ opacity: isOpen ? 1 : 0 }}
				transition={{ duration: 0.3 }}
				style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
				className='fixed inset-0 z-10 bg-black/50 backdrop-blur-md'
				onClick={() => setIsOpen(false)}
			/>
			<motion.nav
				aria-label='Main navigation'
				animate={{ width: isOpen ? 256 : 64 }}
				transition={{ duration: 0.3, ease: 'easeInOut' }}
				className='fixed left-0 top-0 z-20 h-full bg-primary text-foreground shadow-md p-4 flex flex-col gap-4 overflow-hidden'
				onClick={(event) => event.stopPropagation()}>
				<section className='w-full flex items-center justify-between'>
					<motion.div
						animate={{ opacity: isOpen ? 1 : 0 }}
						transition={{ duration: 0.2 }}
						className={`overflow-hidden ${isOpen ? '' : 'w-0'}`}>
						<Link
							href='/home'
							onClick={() => setIsOpen(false)}
							className='text-xl font-bold whitespace-nowrap'>
							QBFlow
						</Link>
					</motion.div>
					<MenuButton
						isOpen={isOpen}
						onClick={() => setIsOpen(!isOpen)}
					/>
				</section>
				<section className='w-full'>
					<ul className='flex flex-col gap-4 mt-4 w-full'>
						{NAV_ITEMS.map(({ icon: Icon, label, path }) => (
							<Link
								href={path}
								key={label}
								title={!isOpen ? label : undefined}
								onClick={() => setIsOpen(false)}
								className='flex items-center gap-2 hover:bg-surface-hover transition-colors duration-200 text-lg rounded-md px-2 py-1 cursor-pointer w-full'>
								<Icon
									aria-hidden='true'
									size={24}
									className='flex-shrink-0'
								/>
								<motion.span
									animate={{ opacity: isOpen ? 1 : 0 }}
									transition={{ duration: 0.2 }}
									className='whitespace-nowrap'>
									{label}
								</motion.span>
							</Link>
						))}
					</ul>
				</section>
				<section className='mt-auto w-full flex justify-center'>
					<ThemeToggler isOpen={isOpen} />
				</section>
			</motion.nav>
		</>
	)
}

export default SideBar
