'use client'

import { motion } from 'framer-motion'
import { Check, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

const Signin = () => {
	const router = useRouter()
	const [rememberMe, setRememberMe] = useState(false)

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		router.push('/home')
	}

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.3
			}
		}
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5
			}
		}
	}

	const titleVariants = {
		hidden: { opacity: 0, x: -50 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.7
			}
		}
	}

	const buttonVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { delay: 0.5 }
		},
		hover: {
			boxShadow: '0 0 20px rgba(91, 239, 118, 0.6)',
			transition: {
				duration: 0.2
			}
		},
		tap: {
			scale: 0.95
		}
	}

	return (
		<main className='bg-black min-h-screen h-screen flex flex-row items-center justify-center relative'>
			<button
				type='button'
				className='absolute top-5 left-5 cursor-pointer text-white z-20'
				onClick={() => router.push('/')}>
				<ChevronLeft size={28} />
			</button>
			<motion.section className='w-1/2 min-h-full relative'>
				<motion.div className='w-full h-full absolute top-0 left-0 overflow-hidden z-1'>
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
							width: '100%',
							height: '400px',
							borderRadius: '50%',
							background: 'rgb(91, 239, 214)',
							filter: 'blur(110px)',
							bottom: '-280px',
							left: '15%'
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
							width: '200px',
							height: '200px',
							borderRadius: '50%',
							background: 'rgb(91, 239, 214)',
							filter: 'blur(65px)',
							bottom: '500px',
							left: '-10%'
						}}
					/>
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
							width: '280px',
							height: '280px',
							borderRadius: '50%',
							background: 'rgb(80, 210, 255)',
							filter: 'blur(90px)',
							bottom: '220px',
							left: '3%'
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
							background: 'rgb(91, 239, 118)',
							filter: 'blur(90px)',
							bottom: '350px',
							left: '75%'
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
							background: 'rgb(91, 239, 118)',
							filter: 'blur(100px)',
							bottom: '90px',
							left: '45%'
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
							bottom: '550px',
							left: '45%'
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
							bottom: '-100px',
							left: '0%'
						}}
					/>
				</motion.div>
				<motion.div className='h-screen relative z-10 flex flex-col items-start justify-center gap-5 px-20 text-white text-center'>
					<motion.h1
						variants={titleVariants}
						initial='hidden'
						animate='visible'
						className='text-5xl w-full'>
						QB Flow
					</motion.h1>
					<motion.p
						variants={itemVariants}
						initial='hidden'
						animate='visible'
						transition={{ delay: 0.3 }}
						className='text-2xl'>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Voluptas, voluptate.
					</motion.p>
				</motion.div>
			</motion.section>
			<motion.section className='w-1/2 min-h-full py-20 px-10 bg-black flex items-center justify-center'>
				<motion.form
					className='w-full max-w-md space-y-6'
					onSubmit={handleSubmit}
					variants={containerVariants}
					initial='hidden'
					animate='visible'>
					<motion.div variants={itemVariants}>
						<h2 className='text-4xl font-bold text-white mb-2'>
							Welcome Back
						</h2>
						<p className='text-gray-400'>
							Sign in to your account to continue
						</p>
					</motion.div>
					<motion.div
						className='space-y-4'
						variants={containerVariants}>
						<motion.div
							className='space-y-1'
							variants={itemVariants}
							transition={{ duration: 0.2 }}>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-300'>
								Email
							</label>
							<motion.input
								type='email'
								id='email'
								placeholder='name@example.com'
								className='w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[rgb(91,239,118)] focus:ring-1 focus:ring-[rgb(91,239,118)] transition'
							/>
						</motion.div>
						<motion.div
							className='space-y-1'
							variants={itemVariants}
							transition={{ duration: 0.2 }}>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-300'>
								Password
							</label>
							<motion.input
								type='password'
								id='password'
								placeholder='••••••••'
								className='w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[rgb(91,239,118)] focus:ring-1 focus:ring-[rgb(91,239,118)] transition'
							/>
						</motion.div>
					</motion.div>
					<motion.div
						className='flex items-center justify-between text-sm'
						variants={itemVariants}>
						<label className='flex items-center gap-2 text-gray-400 cursor-pointer select-none'>
							<input
								type='checkbox'
								checked={rememberMe}
								onChange={(e) =>
									setRememberMe(e.target.checked)
								}
								className='sr-only peer'
								aria-label='Remember me'
							/>
							<motion.span
								className='flex h-5 w-5 items-center justify-center rounded-md border border-gray-600 bg-gray-900 transition peer-focus-visible:ring-2 peer-focus-visible:ring-[rgb(91,239,118)] peer-checked:border-[rgb(91,239,118)] peer-checked:bg-[rgb(91,239,118)]'
								initial={false}
								animate={{
									scale: rememberMe ? 1.04 : 1,
									boxShadow: rememberMe
										? '0 0 0 2px rgba(91,239,118,0.25)'
										: '0 0 0 0px rgba(91,239,118,0)'
								}}
								transition={{ duration: 0.15 }}>
								<Check
									size={14}
									strokeWidth={3}
									className={`transition-opacity ${rememberMe ? 'opacity-100 text-black' : 'opacity-0 text-black'}`}
								/>
							</motion.span>
							<motion.span
								whileHover={{ color: '#e5e7eb' }}
								transition={{ duration: 0.2 }}>
								Remember me
							</motion.span>
						</label>
						<motion.a
							href='#'
							className='text-blue-500 hover:text-blue-400 transition'
							transition={{ duration: 0.2 }}>
							Forgot password?
						</motion.a>
					</motion.div>
					<motion.button
						type='submit'
						className='w-full cursor-pointer bg-[rgb(91,239,118)] hover:bg-green-500 hover:text-white hover:shadow-md text-black font-bold p-4 rounded-lg transition-all duration-300'
						variants={buttonVariants}
						initial='hidden'
						animate='visible'
						whileHover='hover'
						whileTap='tap'>
						Sign In
					</motion.button>
					<motion.p
						className='text-center text-gray-400 text-sm'
						variants={itemVariants}>
						Don't have an account?{' '}
						<motion.a
							href='#'
							className='text-blue-500 hover:text-blue-400 transition'
							whileHover={{ scale: 1.05, color: '#60a5fa' }}
							whileTap={{ scale: 0.95 }}>
							Sign up
						</motion.a>
					</motion.p>
				</motion.form>
			</motion.section>
		</main>
	)
}

export default Signin
