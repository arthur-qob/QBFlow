'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const NAV_LINKS = [
	{ label: 'Home', id: 'home' },
	{ label: 'Features', id: 'features' },
	{ label: 'About', id: 'about' },
	{ label: 'Pricing', id: 'pricing' },
	{ label: 'Contact us', id: 'contact' }
]

const scrollTo = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
	e.preventDefault()
	document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

const NavBar = () => {
	const router = useRouter()

	return (
		<motion.nav
			initial={{ y: -40, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			className='bg-black/50 backdrop-blur-sm fixed top-0 left-0 py-5 px-24 w-full h-auto z-15 flex flex-row items-center justify-between'>
			<h1 className='text-white text-2xl'>QB Flow</h1>

			<ul className='flex flex-row gap-10 text-white'>
				{NAV_LINKS.map(({ label, id }, i) => (
					<motion.li
						key={label}
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.4,
							ease: 'easeOut',
							delay: 0.1 + i * 0.07
						}}
						className="relative before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5 before:bg-white before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100">
						<a
							href={`#${id}`}
							onClick={scrollTo(id)}>
							{label}
						</a>
					</motion.li>
				))}
			</ul>

			<motion.button
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: 'easeOut', delay: 0.5 }}
				type='button'
				onClick={() => router.push('/signin')}
				className='cursor-pointer bg-[rgb(91,239,118)] hover:bg-green-500 hover:text-white hover:shadow-md text-black font-bold py-2 px-4 rounded-lg transition-all duration-300'>
				Get Started
			</motion.button>
		</motion.nav>
	)
}

export default NavBar
