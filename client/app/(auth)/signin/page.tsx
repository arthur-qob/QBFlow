'use client'

import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { signInWithGoogle } from '@/util/firebase/auth'
import { useUser } from '@/app/contexts/userContext'

const Signin = () => {
	const router = useRouter()
	const { firebaseUser } = useUser()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	// Already signed in → redirect to home
	useEffect(() => {
		if (firebaseUser) {
			router.replace('/home')
		}
	}, [firebaseUser, router])

	if (firebaseUser) {
		return null
	}

	const handleGoogleSignIn = async () => {
		setError('')
		setLoading(true)
		try {
			await signInWithGoogle()
			router.push('/home')
		} catch (e: unknown) {
			setError(e instanceof Error ? e.message : 'Sign-in failed. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const titleVariants = {
		hidden: { opacity: 0, x: -50 },
		visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
	}
	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
	}
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
	}

	return (
		<main className='bg-black min-h-screen h-screen flex flex-row items-center justify-center relative'>
			<button
				type='button'
				className='absolute top-5 left-5 cursor-pointer text-white z-20'
				onClick={() => router.push('/')}>
				<ChevronLeft size={28} />
			</button>

			{/* Left – decorative blob panel */}
			<motion.section className='w-1/2 min-h-full relative hidden md:block'>
				<motion.div className='w-full h-full absolute top-0 left-0 overflow-hidden z-1'>
					{[
						{ color: 'rgb(91,239,214)', w: '100%', h: '400px', b: '-280px', l: '15%', dur: 12 },
						{ color: 'rgb(91,239,214)', w: '200px', h: '200px', b: '500px', l: '-10%', dur: 10 },
						{ color: 'rgb(80,210,255)', w: '280px', h: '280px', b: '220px', l: '3%', dur: 14 },
						{ color: 'rgb(91,239,118)', w: '280px', h: '280px', b: '350px', l: '75%', dur: 11 },
						{ color: 'rgb(91,239,118)', w: '350px', h: '350px', b: '90px', l: '45%', dur: 13 }
					].map((blob, i) => (
						<motion.div
							key={i}
							animate={{ x: [0, 15, -10, 0], y: [0, -20, 10, 0], scale: [1, 1.05, 0.98, 1] }}
							transition={{ duration: blob.dur, delay: i * 0.3, repeat: Infinity, repeatType: 'mirror' }}
							style={{
								position: 'absolute',
								width: blob.w,
								height: blob.h,
								borderRadius: '50%',
								background: blob.color,
								filter: 'blur(90px)',
								bottom: blob.b,
								left: blob.l
							}}
						/>
					))}
				</motion.div>

				<motion.div className='h-screen relative z-10 flex flex-col items-start justify-center gap-5 px-20 text-white'>
					<motion.h1
						variants={titleVariants}
						initial='hidden'
						animate='visible'
						className='text-5xl font-bold'>
						QB Flow
					</motion.h1>
					<motion.p
						variants={itemVariants}
						initial='hidden'
						animate='visible'
						className='text-xl text-white/70 max-w-sm'>
						Streamline your document workflow. Generate packing slips, invoices and more — in seconds.
					</motion.p>
				</motion.div>
			</motion.section>

			{/* Right – sign-in form */}
			<motion.section className='w-full md:w-1/2 min-h-full py-20 px-10 bg-black flex items-center justify-center'>
				<motion.div
					className='w-full max-w-md space-y-8'
					variants={containerVariants}
					initial='hidden'
					animate='visible'>

					<motion.div variants={itemVariants}>
						<h2 className='text-4xl font-bold text-white mb-2'>Welcome Back</h2>
						<p className='text-gray-400'>Sign in to continue to QBFlow</p>
					</motion.div>

					{error && (
						<motion.div
							variants={itemVariants}
							className='bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm text-red-400'>
							{error}
						</motion.div>
					)}

					<motion.button
						variants={itemVariants}
						onClick={handleGoogleSignIn}
						disabled={loading}
						whileHover={{ boxShadow: '0 0 24px rgba(91,239,118,0.4)' }}
						whileTap={{ scale: 0.97 }}
						className='w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold py-4 rounded-xl transition-all duration-200 cursor-pointer'>
						{!loading && (
							/* Google G SVG */
							<svg width='20' height='20' viewBox='0 0 48 48'>
								<path fill='#EA4335' d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z' />
								<path fill='#4285F4' d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z' />
								<path fill='#FBBC05' d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z' />
								<path fill='#34A853' d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z' />
							</svg>
						)}
						{loading ? (
							<span className='flex items-center gap-2'>
								<svg className='animate-spin h-5 w-5' viewBox='0 0 24 24' fill='none'>
									<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
									<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z' />
								</svg>
								Signing in…
							</span>
						) : (
							'Continue with Google'
						)}
					</motion.button>

					<motion.p
						variants={itemVariants}
						className='text-center text-gray-600 text-xs'>
						By signing in you agree to our terms of service.
					</motion.p>
				</motion.div>
			</motion.section>
		</main>
	)
}

export default Signin
