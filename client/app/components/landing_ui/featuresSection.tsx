'use client'

import { CloudUpload, FileSpreadsheet, ClipboardList, ArrowRight } from 'lucide-react'
import { FadeUp, Stagger, StaggerItem } from './motion'

const QB_FEATURES = [
	'Purchase Orders',
	'Bills',
	'Estimates',
	'Invoices',
	'Packing Slips',
	'Products & Services',
]

const FEATURES = [
	{
		icon: CloudUpload,
		label: 'QuickBooks Upload',
		accent: 'rgb(91,239,118)',
		accentDim: 'rgba(91,239,118,0.12)',
		accentBorder: 'rgba(91,239,118,0.25)',
		title: 'Seamless QuickBooks Integration',
		description:
			'Upload structured data directly into QuickBooks in seconds. Support for every major transaction and record type — no manual entry, no errors.',
		tags: QB_FEATURES,
	},
	{
		icon: FileSpreadsheet,
		label: 'PDF → Excel',
		accent: 'rgb(91,239,214)',
		accentDim: 'rgba(91,239,214,0.12)',
		accentBorder: 'rgba(91,239,214,0.25)',
		title: 'Built-in PDF to Excel Converter',
		description:
			'Instantly convert any PDF document into a clean, structured Excel spreadsheet. Preserve tables, line items, and formatting without lifting a finger.',
		tags: ['PDF Import', 'Auto Table Detection', 'Multi-page Support', 'Instant Download'],
	},
	{
		icon: ClipboardList,
		label: 'Upload Sheet Creator',
		accent: 'rgb(80,210,255)',
		accentDim: 'rgba(80,210,255,0.12)',
		accentBorder: 'rgba(80,210,255,0.25)',
		title: 'Upload Sheet Creator from PDFs',
		description:
			'Extract and map data from Invoices and Packing Slips into QuickBooks-ready upload sheets automatically. Turn documents into data in one click.',
		tags: ['Invoice Parsing', 'Packing Slip Parsing', 'Field Mapping', 'QB-Ready Output'],
	},
]

export default function FeaturesSection() {
	return (
		<section id='features' className='w-full min-h-screen px-26 pt-10 relative overflow-hidden'>
			{/* Section heading */}
			<FadeUp className='relative z-10 flex flex-col items-center gap-4 mb-10'>
				<span
					className='text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border'
					style={{
						color: 'rgb(91,239,214)',
						borderColor: 'rgba(91,239,214,0.3)',
						background: 'rgba(91,239,214,0.08)',
					}}>
					What QBFlow does
				</span>
				<h2 className='text-white text-5xl font-thin text-center leading-tight'>
					Everything you need,{' '}
					<span
						className='bg-clip-text text-transparent'
						style={{
							backgroundImage: 'linear-gradient(to right, rgb(91,239,118), rgb(91,239,214))',
						}}>
						nothing you don&apos;t.
					</span>
				</h2>
				<p className='text-white/50 text-base text-center max-w-xl'>
					QBFlow automates the tedious parts of bookkeeping so your team can focus on what
					actually matters.
				</p>
			</FadeUp>

			{/* Feature cards — staggered */}
			<Stagger className='relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto'>
				{FEATURES.map(({ icon: Icon, label, accent, accentDim, accentBorder, title, description, tags }) => (
					<StaggerItem key={label}>
						<div
							className='flex flex-col gap-5 rounded-2xl p-6 border transition-all duration-300 group hover:-translate-y-1 h-full'
							style={{
								background: 'rgba(255,255,255,0.03)',
								borderColor: accentBorder,
								boxShadow: `0 0 40px ${accentDim}`,
							}}>
							<div className='flex items-center gap-3'>
								<div
									className='w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0'
									style={{ background: accentDim, border: `1px solid ${accentBorder}` }}>
									<Icon size={18} style={{ color: accent }} />
								</div>
								<span className='text-xs font-semibold tracking-wider uppercase' style={{ color: accent }}>
									{label}
								</span>
							</div>

							<div className='flex flex-col gap-2'>
								<h3 className='text-white text-lg font-semibold leading-snug'>{title}</h3>
								<p className='text-white/50 text-sm leading-relaxed'>{description}</p>
							</div>

							<div className='flex flex-wrap gap-2 mt-auto'>
								{tags.map((tag) => (
									<span
										key={tag}
										className='text-xs px-2.5 py-1 rounded-full'
										style={{ color: accent, background: accentDim, border: `1px solid ${accentBorder}` }}>
										{tag}
									</span>
								))}
							</div>

							<div
								className='flex items-center gap-1 text-xs font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
								style={{ color: accent }}>
								Learn more <ArrowRight size={13} />
							</div>
						</div>
					</StaggerItem>
				))}
			</Stagger>
		</section>
	)
}
