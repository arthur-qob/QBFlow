'use client'

import { BookOpen, Zap, ShieldCheck } from 'lucide-react'
import { FadeUp, SlideLeft, SlideRight, Stagger, StaggerItem } from './motion'

const PILLARS = [
	{
		icon: BookOpen,
		accent: 'rgb(91,239,118)',
		accentDim: 'rgba(91,239,118,0.1)',
		accentBorder: 'rgba(91,239,118,0.2)',
		title: 'Built for bookkeepers',
		body: 'QBFlow was designed from the ground up by people who know the pain of manual data entry. Every workflow mirrors the way real accounting teams actually work.',
	},
	{
		icon: Zap,
		accent: 'rgb(91,239,214)',
		accentDim: 'rgba(91,239,214,0.1)',
		accentBorder: 'rgba(91,239,214,0.2)',
		title: 'Speed without sacrifice',
		body: 'What used to take hours now takes minutes. QBFlow automates the repetitive steps so you can move faster without introducing errors or cutting corners.',
	},
	{
		icon: ShieldCheck,
		accent: 'rgb(80,210,255)',
		accentDim: 'rgba(80,210,255,0.1)',
		accentBorder: 'rgba(80,210,255,0.2)',
		title: 'Accuracy you can trust',
		body: 'Every upload is validated before it reaches QuickBooks. Catch mismatches, duplicates, and formatting issues before they become costly problems.',
	},
]

const AboutSection = () => {
	return (
		<section id='about' className='w-full px-26 pt-26 relative overflow-hidden'>
			<div className='relative z-10 max-w-6xl mx-auto flex flex-col gap-20'>
				{/* Top: label + headline + body split */}
				<div className='flex flex-col md:flex-row gap-12 items-start'>
					<SlideLeft className='flex flex-col gap-4 md:w-1/2'>
						<span
							className='text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border w-fit'
							style={{
								color: 'rgb(91,239,118)',
								borderColor: 'rgba(91,239,118,0.3)',
								background: 'rgba(91,239,118,0.08)',
							}}>
							About QBFlow
						</span>
						<h2 className='text-white text-5xl font-thin leading-tight'>
							Accounting tools{' '}
							<span
								className='bg-clip-text text-transparent'
								style={{
									backgroundImage: 'linear-gradient(to right, rgb(91,239,214), rgb(80,210,255))',
								}}>
								that work for you.
							</span>
						</h2>
					</SlideLeft>

					<SlideRight delay={0.1} className='md:w-1/2 flex flex-col gap-4 justify-center'>
						<p className='text-white/60 text-base leading-relaxed'>
							QBFlow is a productivity platform built to eliminate the friction between your
							source documents and QuickBooks. Whether you&apos;re processing a stack of
							vendor invoices or generating purchase orders from a PDF, QBFlow turns what was
							once tedious manual work into a streamlined, automated workflow.
						</p>
						<p className='text-white/40 text-sm leading-relaxed'>
							No more copy-pasting line items. No more reformatting spreadsheets by hand. Just
							clean, validated data flowing directly into QuickBooks — the way it should have
							always worked.
						</p>
					</SlideRight>
				</div>

				{/* Pillars — staggered */}
				<Stagger className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					{PILLARS.map(({ icon: Icon, accent, accentDim, accentBorder, title, body }) => (
						<StaggerItem key={title}>
							<div className='flex flex-col gap-4'>
								<div
									className='w-11 h-11 rounded-xl flex items-center justify-center'
									style={{ background: accentDim, border: `1px solid ${accentBorder}` }}>
									<Icon size={20} style={{ color: accent }} />
								</div>
								<h3 className='text-white text-lg font-semibold'>{title}</h3>
								<p className='text-white/50 text-sm leading-relaxed'>{body}</p>
							</div>
						</StaggerItem>
					))}
				</Stagger>

				{/* Bottom stat bar */}
				<FadeUp>
					<div
						className='rounded-2xl p-8 grid grid-cols-3 divide-x divide-white/25'
						style={{
							background: 'rgba(255,255,255,0.03)',
							border: '1px solid rgba(255,255,255,0.25)',
						}}>
						{[
							{ value: '6+', label: 'QuickBooks record types', accent: 'rgb(91,239,118)' },
							{ value: '100%', label: 'Browser-based, nothing to install', accent: 'rgb(91,239,214)' },
							{ value: '1-click', label: 'PDF to upload sheet', accent: 'rgb(80,210,255)' },
						].map(({ value, label, accent }) => (
							<div key={label} className='flex flex-col items-center gap-1 px-6'>
								<span className='text-4xl font-thin' style={{ color: accent }}>
									{value}
								</span>
								<span className='text-white/40 text-xs text-center'>{label}</span>
							</div>
						))}
					</div>
				</FadeUp>
			</div>
		</section>
	)
}

export default AboutSection
