'use client'

import { motion } from 'framer-motion'
import { Mail, Clock, Send } from 'lucide-react'
import Footer from './footer'
import { FadeUp, SlideLeft, SlideRight, Stagger, StaggerItem } from './motion'

export default function ContactSection() {
	return (
		<section
			id='contact'
			className='w-full px-26 pt-26 pb-10 relative overflow-hidden'>
			{/* Background */}
			<div
				className='absolute top-0 left-0 w-full h-full z-0'
				style={{ background: 'rgb(91,239,118)' }}>
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
						width: '155vw',
						height: '200vw',
						borderRadius: '50%',
						background: 'rgb(0,0,0)',
						filter: 'blur(110px)',
						bottom: '-20vw',
						right: '-350px'
					}}
				/>
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
						width: '400px',
						height: '400px',
						borderRadius: '50%',
						background: 'rgb(91,239,214)',
						filter: 'blur(110px)',
						bottom: '-250px',
						left: '8%'
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
						background: 'rgb(80,210,255)',
						filter: 'blur(90px)',
						bottom: '-150px',
						left: '34%'
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
						width: '240px',
						height: '240px',
						borderRadius: '50%',
						background: 'rgb(30,138,120)',
						filter: 'blur(85px)',
						bottom: '-120px',
						left: '56%'
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
						width: '160px',
						height: '160px',
						borderRadius: '50%',
						background: 'rgb(10,130,255)',
						filter: 'blur(65px)',
						bottom: '10px',
						left: '76%'
					}}
				/>
			</div>

			<div className='relative z-10 max-w-6xl mx-auto flex flex-col gap-14'>
				{/* Heading */}
				<FadeUp className='flex flex-col items-center gap-4'>
					<span
						className='text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border'
						style={{
							color: 'rgb(91,239,118)',
							borderColor: 'rgba(91,239,118,0.3)',
							background: 'rgba(91,239,118,0.08)'
						}}>
						Contact
					</span>
					<h2 className='text-white text-5xl font-thin text-center leading-tight'>
						Let&apos;s{' '}
						<span
							className='bg-clip-text text-transparent'
							style={{
								backgroundImage:
									'linear-gradient(to right, rgb(91,239,214), rgb(80,210,255))'
							}}>
							get in touch.
						</span>
					</h2>
					<p className='text-white/50 text-base text-center max-w-md'>
						Have a question, need a demo, or want to discuss
						Enterprise pricing? We&apos;ll get back to you fast.
					</p>
				</FadeUp>

				{/* Two-column: info + form */}
				<div className='flex flex-col md:flex-row gap-12 items-start'>
					{/* Left — contact info */}
					<SlideLeft className='md:w-2/5 flex flex-col gap-8'>
						<Stagger className='flex flex-col gap-6'>
							{[
								{
									icon: Mail,
									label: 'Email us',
									value: 'hello@qbflow.io',
									accent: 'rgb(91,239,118)',
									accentDim: 'rgba(91,239,118,0.1)',
									accentBorder: 'rgba(91,239,118,0.2)'
								},
								{
									icon: Clock,
									label: 'Response time',
									value: 'Within 24 hours',
									accent: 'rgb(91,239,214)',
									accentDim: 'rgba(91,239,214,0.1)',
									accentBorder: 'rgba(91,239,214,0.2)'
								}
							].map(
								({
									icon: Icon,
									label,
									value,
									accent,
									accentDim,
									accentBorder
								}) => (
									<StaggerItem key={label}>
										<div className='flex items-center gap-4'>
											<div
												className='w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0'
												style={{
													background: accentDim,
													border: `1px solid ${accentBorder}`
												}}>
												<Icon
													size={18}
													style={{ color: accent }}
												/>
											</div>
											<div className='flex flex-col'>
												<span className='text-white/40 text-xs'>
													{label}
												</span>
												<span className='text-white text-sm font-medium'>
													{value}
												</span>
											</div>
										</div>
									</StaggerItem>
								)
							)}
						</Stagger>

						<div
							className='w-full h-px'
							style={{
								background:
									'linear-gradient(to right, rgba(255,255,255,0.1), transparent)'
							}}
						/>

						<p className='text-white/30 text-sm leading-relaxed'>
							QBFlow is actively developed. Your feedback directly
							shapes what we build next — don&apos;t hesitate to
							reach out.
						</p>
					</SlideLeft>

					{/* Right — form */}
					<SlideRight
						delay={0.1}
						className='md:w-3/5'>
						<form className='flex flex-col gap-4'>
							<div className='flex flex-col md:flex-row gap-4'>
								<div className='flex flex-col gap-1.5 flex-1'>
									<label className='text-white/50 text-xs font-medium'>
										Name
									</label>
									<input
										type='text'
										placeholder='Your name'
										className='rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:ring-1 transition-all duration-200'
										style={{
											background:
												'rgba(255,255,255,0.05)',
											border: '1px solid rgba(255,255,255,0.1)'
										}}
									/>
								</div>
								<div className='flex flex-col gap-1.5 flex-1'>
									<label className='text-white/50 text-xs font-medium'>
										Email
									</label>
									<input
										type='email'
										placeholder='you@company.com'
										className='rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:ring-1 transition-all duration-200'
										style={{
											background:
												'rgba(255,255,255,0.05)',
											border: '1px solid rgba(255,255,255,0.1)'
										}}
									/>
								</div>
							</div>

							<div className='flex flex-col gap-1.5'>
								<label className='text-white/50 text-xs font-medium'>
									Subject
								</label>
								<input
									type='text'
									placeholder='How can we help?'
									className='rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:ring-1 transition-all duration-200'
									style={{
										background: 'rgba(255,255,255,0.05)',
										border: '1px solid rgba(255,255,255,0.1)'
									}}
								/>
							</div>

							<div className='flex flex-col gap-1.5'>
								<label className='text-white/50 text-xs font-medium'>
									Message
								</label>
								<textarea
									rows={5}
									placeholder='Tell us more...'
									className='rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:ring-1 transition-all duration-200 resize-none'
									style={{
										background: 'rgba(255,255,255,0.05)',
										border: '1px solid rgba(255,255,255,0.1)'
									}}
								/>
							</div>

							<button
								type='button'
								className='cursor-pointer bg-[rgb(91,239,118)] hover:bg-green-500 hover:text-white hover:shadow-md text-black font-bold p-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2'>
								Send message
								<Send size={14} />
							</button>
						</form>
					</SlideRight>
				</div>

				<Footer />
			</div>
		</section>
	)
}
