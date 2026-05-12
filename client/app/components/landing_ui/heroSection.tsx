'use client'

import { ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const HeroSection = () => {
	const [showScrollDownBtn, setShowScrollDownBtn] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => setShowScrollDownBtn(true), 5000)
		return () => clearTimeout(timer)
	}, [])

	return (
		<section
			id='home'
			className='w-full min-h-screen relative'>
			<div className='bg-[rgb(91,239,118)] w-full h-full absolute top-0 left-0 overflow-hidden z-1'>
				<motion.div
					animate={{
						x: [0, 20, -10, 0],
						y: [0, -25, 10, 0],
						scale: [1, 1.04, 0.98, 1],
						opacity: [0.9, 1, 0.9]
					}}
					transition={{
						duration: 12,
						repeat: Infinity,
						repeatType: 'mirror'
					}}
					style={{
						position: 'absolute',
						width: '150vw',
						height: '200vw',
						borderRadius: '50%',
						background: 'rgb(0, 0, 0)',
						filter: 'blur(110px)',
						bottom: '-20vw',
						left: '-350px'
					}}></motion.div>
				<motion.div
					animate={{
						x: [0, -15, 8, 0],
						y: [0, 20, -10, 0],
						scale: [1, 1.06, 1],
						opacity: [0.8, 1, 0.8]
					}}
					transition={{
						duration: 10,
						delay: 0.5,
						repeat: Infinity,
						repeatType: 'mirror'
					}}
					style={{
						position: 'absolute',
						width: '100%',
						height: '400px',
						borderRadius: '50%',
						background: 'rgb(91, 239, 214)',
						filter: 'blur(110px)',
						bottom: '-250px',
						left: '8%'
					}}></motion.div>
				<motion.div
					animate={{
						x: [0, 12, -18, 0],
						y: [0, -30, 8, 0],
						scale: [1, 1.05, 0.97, 1],
						opacity: [0.85, 1, 0.85]
					}}
					transition={{
						duration: 14,
						delay: 1,
						repeat: Infinity,
						repeatType: 'mirror'
					}}
					style={{
						position: 'absolute',
						width: '400px',
						height: '400px',
						borderRadius: '50%',
						background: 'rgb(91, 239, 214)',
						filter: 'blur(110px)',
						bottom: '-275px',
						left: '8%'
					}}
				/>
				<motion.div
					animate={{
						x: [0, -24, 14, 0],
						y: [0, 22, -12, 0],
						scale: [1, 1.03, 1],
						opacity: [0.8, 0.95, 0.8]
					}}
					transition={{
						duration: 11,
						delay: 0.8,
						repeat: Infinity,
						repeatType: 'mirror'
					}}
					style={{
						position: 'absolute',
						width: '280px',
						height: '280px',
						borderRadius: '50%',
						background: 'rgb(80, 210, 255)',
						filter: 'blur(90px)',
						bottom: '-150px',
						left: '38%'
					}}
				/>
				<motion.div
					animate={{
						x: [0, 18, -10, 0],
						y: [0, -35, 12, 0],
						scale: [1, 1.05, 0.98, 1],
						opacity: [0.85, 1, 0.85]
					}}
					transition={{
						duration: 13,
						delay: 1.3,
						repeat: Infinity,
						repeatType: 'mirror'
					}}
					style={{
						position: 'absolute',
						width: '350px',
						height: '350px',
						borderRadius: '50%',
						background: 'rgb(30, 138, 120)',
						filter: 'blur(100px)',
						bottom: '-140px',
						left: '52%'
					}}
				/>
				<motion.div
					animate={{
						x: [0, -12, 16, 0],
						y: [0, 14, -8, 0],
						scale: [1, 1.04, 1],
						opacity: [0.8, 0.95, 0.8]
					}}
					transition={{
						duration: 9,
						delay: 0.3,
						repeat: Infinity,
						repeatType: 'mirror'
					}}
					style={{
						position: 'absolute',
						width: '220px',
						height: '220px',
						borderRadius: '50%',
						background: 'rgb(91, 239, 214)',
						filter: 'blur(75px)',
						bottom: '-60px',
						left: '74%'
					}}
				/>
				<motion.div
					animate={{
						x: [0, 16, -6, 0],
						y: [0, -20, 6, 0],
						scale: [1, 1.05, 1],
						opacity: [0.9, 1, 0.9]
					}}
					transition={{
						duration: 8,
						delay: 1.1,
						repeat: Infinity,
						repeatType: 'mirror'
					}}
					style={{
						position: 'absolute',
						width: '180px',
						height: '180px',
						borderRadius: '50%',
						background: 'rgb(10, 130, 255)',
						filter: 'blur(65px)',
						bottom: '20px',
						left: '88%'
					}}
				/>
			</div>

			<div className='px-26 pt-26 flex flex-col justify-center gap-25 z-10 relative h-full'>
				<div className='flex flex-row items-center gap-20'>
					<motion.h1
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.65,
							ease: 'easeOut',
							delay: 0.2
						}}
						className='text-white text-6xl leading-tight font-thin w-145'>
						<span className='bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
							Your books, handled
						</span>{' '}
						<span className='text-green-400'>effortlessly.</span>{' '}
						<span className='text-white'>You stay focused.</span>
					</motion.h1>

					<motion.div
						initial={{ opacity: 0, x: 40 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{
							duration: 0.65,
							ease: 'easeOut',
							delay: 0.35
						}}
						className='w-150 h-75 bg-white/50 backdrop-blur-sm z-10 relative rounded-lg flex items-center justify-center'>
						<span>IMG OF THE SYSTEM HERE</span>
					</motion.div>
				</div>

				<motion.button
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: 'easeOut', delay: 0.55 }}
					type='button'
					className='w-50 cursor-pointer bg-[rgb(91,239,118)] hover:bg-green-500 hover:-translate-y-1 hover:text-white hover:shadow-md text-black font-bold p-4 rounded-lg transition-all duration-300'>
					See plans & pricing
				</motion.button>
			</div>

			{showScrollDownBtn && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: 'easeOut' }}
					className='absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full text-sm px-5 py-2.5 animate-bounce z-10 flex items-center gap-2 shadow-md whitespace-nowrap'>
					<span>Scroll down to see more</span>
					<ChevronDown size={16} />
				</motion.div>
			)}
		</section>
	)
}

export default HeroSection
