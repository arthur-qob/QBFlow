'use client'

import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'
import { FadeUp, Stagger, StaggerItem } from './motion'

const PLANS = [
	{
		name: 'Starter',
		price: 'Free',
		period: null,
		description:
			'For individuals getting started with QuickBooks automation.',
		accent: 'rgb(91,239,214)',
		accentDim: 'rgba(91,239,214,0.1)',
		accentBorder: 'rgba(91,239,214,0.2)',
		popular: false,
		features: [
			'50 uploads / month',
			'QuickBooks CSV upload',
			'PDF to Excel converter',
			'Invoices & Packing Slips',
			'Email support'
		]
	},
	{
		name: 'Professional',
		price: '$29',
		period: '/ month',
		description:
			'For growing teams that need full automation and all record types.',
		accent: 'rgb(91,239,118)',
		accentDim: 'rgba(91,239,118,0.12)',
		accentBorder: 'rgba(91,239,118,0.3)',
		popular: true,
		features: [
			'Unlimited uploads',
			'All 6 QuickBooks record types',
			'Upload Sheet Creator',
			'PDF to Excel converter',
			'Field mapping customization',
			'Priority support'
		]
	},
	{
		name: 'Enterprise',
		price: 'Custom',
		period: null,
		description:
			'For large teams with high volume needs and custom integrations.',
		accent: 'rgb(80,210,255)',
		accentDim: 'rgba(80,210,255,0.1)',
		accentBorder: 'rgba(80,210,255,0.2)',
		popular: false,
		features: [
			'Everything in Professional',
			'Custom record type mapping',
			'Dedicated onboarding',
			'SLA guarantee',
			'Team accounts & roles',
			'Dedicated account manager'
		]
	}
]

export default function PricingSection() {
	return (
		<section
			id='pricing'
			className='w-full min-h-screen px-26 pt-26 pb-10 relative overflow-hidden'>
			<div className='absolute top-0 left-0 w-full h-full z-0'>
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
						height: '195vw',
						borderRadius: '50%',
						background: 'rgb(0,0,0)',
						filter: 'blur(110px)',
						top: '-25vw',
						left: '-380px'
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
						width: '380px',
						height: '380px',
						borderRadius: '50%',
						background: 'rgb(91,239,118)',
						filter: 'blur(110px)',
						bottom: '-220px',
						right: '8%'
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
						width: '300px',
						height: '300px',
						borderRadius: '50%',
						background: 'rgb(91,239,214)',
						filter: 'blur(95px)',
						bottom: '-160px',
						right: '34%'
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
						width: '220px',
						height: '220px',
						borderRadius: '50%',
						background: 'rgb(80,210,255)',
						filter: 'blur(85px)',
						bottom: '-90px',
						right: '58%'
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
						width: '170px',
						height: '170px',
						borderRadius: '50%',
						background: 'rgb(80,40,220)',
						filter: 'blur(70px)',
						bottom: '-30px',
						right: '76%'
					}}
				/>
			</div>

			{/* Heading */}
			<FadeUp className='relative z-10 flex flex-col items-center gap-4 mb-14'>
				<span
					className='text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border'
					style={{
						color: 'rgb(91,239,118)',
						borderColor: 'rgba(91,239,118,0.3)',
						background: 'rgba(91,239,118,0.08)'
					}}>
					Pricing
				</span>
				<h2 className='text-white text-5xl font-thin text-center leading-tight'>
					Simple,{' '}
					<span
						className='bg-clip-text text-transparent'
						style={{
							backgroundImage:
								'linear-gradient(to right, rgb(91,239,118), rgb(91,239,214))'
						}}>
						transparent pricing.
					</span>
				</h2>
				<p className='text-white/50 text-base text-center max-w-md'>
					No hidden fees. Start free and scale when you&apos;re ready.
				</p>
			</FadeUp>

			{/* Cards — staggered, popular card scales up slightly */}
			<Stagger className='relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto'>
				{PLANS.map(
					({
						name,
						price,
						period,
						description,
						accent,
						accentDim,
						accentBorder,
						popular,
						features
					}) => (
						<StaggerItem key={name}>
							<div
								className='relative flex flex-col gap-6 rounded-2xl p-7 border transition-all duration-300 hover:-translate-y-1 h-full'
								style={{
									background: popular
										? 'rgba(255,255,255,0.06)'
										: 'rgba(255,255,255,0.03)',
									borderColor: accentBorder,
									boxShadow: popular
										? `0 0 60px ${accentDim}`
										: `0 0 30px ${accentDim}`,
									transform: popular
										? 'scale(1.02)'
										: undefined
								}}>
								{popular && (
									<div
										className='absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full'
										style={{
											background: accent,
											color: 'rgb(0,0,0)'
										}}>
										<Zap size={11} />
										Most Popular
									</div>
								)}

								<div className='flex flex-col gap-1'>
									<span
										className='text-xs font-semibold tracking-wider uppercase'
										style={{ color: accent }}>
										{name}
									</span>
									<div className='flex items-end gap-1'>
										<span className='text-4xl font-thin text-white'>
											{price}
										</span>
										{period && (
											<span className='text-white/40 text-sm mb-1'>
												{period}
											</span>
										)}
									</div>
									<p className='text-white/40 text-sm leading-relaxed'>
										{description}
									</p>
								</div>

								<div
									className='h-px w-full'
									style={{ background: accentBorder }}
								/>

								<ul className='flex flex-col gap-3 flex-1'>
									{features.map((f) => (
										<li
											key={f}
											className='flex items-start gap-2.5 text-sm text-white/70'>
											<Check
												size={14}
												className='mt-0.5 flex-shrink-0'
												style={{ color: accent }}
											/>
											{f}
										</li>
									))}
								</ul>

								<button
									type='button'
									className='w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5'
									style={
										popular
											? {
													background: accent,
													color: 'rgb(0,0,0)'
												}
											: {
													background: accentDim,
													color: 'rgb(255,255,255)',
													border: `1px solid ${accentBorder}`
												}
									}>
									{price === 'Custom'
										? 'Contact us'
										: 'Get started'}
								</button>
							</div>
						</StaggerItem>
					)
				)}
			</Stagger>
		</section>
	)
}
