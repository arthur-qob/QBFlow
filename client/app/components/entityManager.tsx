'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Plus,
	Search,
	Edit,
	Trash2,
	Building2,
	Mail,
	Phone,
	Globe,
	MapPin,
	X,
	Loader2,
	Palette,
	Image as ImageIcon
} from 'lucide-react'
import type { Client } from '@/util/types'

interface EntityCRUDProps {
	entityName: 'Client' | 'Vendor' | 'Buyer'
	entityPlural: 'Clients' | 'Vendors' | 'Buyers'
	entities: Client[]
	loading: boolean
	error: string | null
	onSave: (data: Partial<Client>) => Promise<void>
	onDelete: (id: string) => Promise<void>
}

export default function EntityManager({
	entityName,
	entityPlural,
	entities,
	loading,
	error,
	onSave,
	onDelete
}: EntityCRUDProps) {
	const [search, setSearch] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingEntity, setEditingEntity] = useState<Client | null>(null)
	const [submitting, setSubmitting] = useState(false)
	const [formError, setFormError] = useState<string | null>(null)

	// Form fields
	const [name, setName] = useState('')
	const [address, setAddress] = useState('')
	const [city, setCity] = useState('')
	const [phone, setPhone] = useState('')
	const [email, setEmail] = useState('')
	const [website, setWebsite] = useState('')
	const [logoB64, setLogoB64] = useState('')
	const [colorTheme, setColorTheme] = useState('#4a5080')

	const openCreateModal = () => {
		setEditingEntity(null)
		setName('')
		setAddress('')
		setCity('')
		setPhone('')
		setEmail('')
		setWebsite('')
		setLogoB64('')
		setColorTheme('#4a5080')
		setFormError(null)
		setIsModalOpen(true)
	}

	const openEditModal = (entity: Client) => {
		setEditingEntity(entity)
		setName(entity.name || '')
		setAddress(entity.address || '')
		setCity(entity.city || '')
		setPhone(entity.phone || '')
		setEmail(entity.email || '')
		setWebsite(entity.website || '')
		setLogoB64(entity.logo_b64 || '')
		setColorTheme(entity.color_theme || '#4a5080')
		setFormError(null)
		setIsModalOpen(true)
	}

	const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return
		const reader = new FileReader()
		reader.onload = () => {
			setLogoB64(reader.result as string)
		}
		reader.readAsDataURL(file)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!name.trim()) {
			setFormError('Name is required.')
			return
		}

		setSubmitting(true)
		setFormError(null)
		try {
			await onSave({
				...(editingEntity ? { id: editingEntity.id } : {}),
				name: name.trim(),
				address: address.trim(),
				city: city.trim(),
				phone: phone.trim(),
				email: email.trim(),
				website: website.trim(),
				logo_b64: logoB64,
				color_theme: colorTheme
			})
			setIsModalOpen(false)
		} catch (err: unknown) {
			setFormError(err instanceof Error ? err.message : 'Failed to save.')
		} finally {
			setSubmitting(false)
		}
	}

	const filtered = entities.filter((e) =>
		[e.name, e.email, e.city, e.phone].some((v) =>
			(v || '').toLowerCase().includes(search.toLowerCase())
		)
	)

	return (
		<main className='pl-24 pr-10 py-8 min-h-screen w-full bg-secondary text-foreground'>
			<div className='max-w-6xl mx-auto'>
				{/* Header */}
				<header className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
					<div>
						<h1 className='text-2xl font-bold tracking-tight'>{entityPlural}</h1>
						<p className='text-sm text-foreground-muted mt-0.5'>
							Manage profiles, addresses, contact details and styling presets.
						</p>
					</div>
					<button
						onClick={openCreateModal}
						className='flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer w-fit shadow-sm text-sm'>
						<Plus size={18} />
						Add {entityName}
					</button>
				</header>

				{/* Search & Stats Bar */}
				<div className='flex items-center justify-between gap-4 mb-6 bg-primary border border-secondary rounded-xl p-3 shadow-sm'>
					<div className='relative flex-1 max-w-md'>
						<Search
							size={16}
							className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted'
						/>
						<input
							type='text'
							placeholder={`Search ${entityPlural.toLowerCase()}...`}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className='w-full bg-surface border border-secondary rounded-lg pl-9 pr-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-emerald-500'
						/>
					</div>
					<span className='text-xs text-foreground-muted font-medium pr-2'>
						{filtered.length} {filtered.length === 1 ? entityName : entityPlural}
					</span>
				</div>

				{/* Error State */}
				{error && (
					<div className='p-4 mb-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm'>
						{error}
					</div>
				)}

				{/* Loading State */}
				{loading ? (
					<div className='flex items-center justify-center py-20 text-foreground-muted'>
						<Loader2 size={32} className='animate-spin text-emerald-400' />
					</div>
				) : filtered.length === 0 ? (
					<div className='text-center py-20 bg-primary border border-secondary rounded-xl'>
						<Building2 size={40} className='mx-auto mb-3 opacity-30 text-foreground-muted' />
						<h3 className='font-semibold text-foreground text-base'>No {entityPlural.toLowerCase()} found</h3>
						<p className='text-xs text-foreground-muted mt-1 max-w-sm mx-auto'>
							{search
								? 'Try adjusting your search criteria.'
								: `Get started by clicking "+ Add ${entityName}" above.`}
						</p>
					</div>
				) : (
					/* Entity Grid */
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
						{filtered.map((entity) => (
							<motion.div
								key={entity.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className='bg-primary border border-secondary rounded-xl p-5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between'>
								<div>
									{/* Top card banner */}
									<div className='flex items-start justify-between gap-3 mb-3'>
										<div className='flex items-center gap-3'>
											{entity.logo_b64 ? (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													src={entity.logo_b64}
													alt={entity.name}
													className='w-10 h-10 object-contain rounded-lg border border-secondary bg-surface p-1'
												/>
											) : (
												<div
													style={{ backgroundColor: `${entity.color_theme || '#4a5080'}25`, color: entity.color_theme || '#4a5080' }}
													className='w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm'>
													{entity.name.substring(0, 2).toUpperCase() || 'CO'}
												</div>
											)}
											<div>
												<h3 className='font-semibold text-base text-foreground leading-snug'>
													{entity.name}
												</h3>
												{entity.city && (
													<p className='text-xs text-foreground-muted flex items-center gap-1 mt-0.5'>
														<MapPin size={12} /> {entity.city}
													</p>
												)}
											</div>
										</div>

										<div
											title={`Brand color: ${entity.color_theme}`}
											style={{ backgroundColor: entity.color_theme || '#4a5080' }}
											className='w-3.5 h-3.5 rounded-full border border-secondary flex-shrink-0 mt-1'
										/>
									</div>

									{/* Info body */}
									<div className='space-y-1.5 text-xs text-foreground-muted pt-2 border-t border-secondary'>
										{entity.email && (
											<div className='flex items-center gap-2 truncate'>
												<Mail size={13} className='text-foreground-muted flex-shrink-0' />
												<span className='truncate'>{entity.email}</span>
											</div>
										)}
										{entity.phone && (
											<div className='flex items-center gap-2 truncate'>
												<Phone size={13} className='text-foreground-muted flex-shrink-0' />
												<span className='truncate'>{entity.phone}</span>
											</div>
										)}
										{entity.website && (
											<div className='flex items-center gap-2 truncate'>
												<Globe size={13} className='text-foreground-muted flex-shrink-0' />
												<span className='truncate'>{entity.website}</span>
											</div>
										)}
										{entity.address && (
											<p className='text-[11px] text-foreground-muted/80 line-clamp-2 pt-1 font-mono whitespace-pre-line'>
												{entity.address}
											</p>
										)}
									</div>
								</div>

								{/* Card actions */}
								<div className='flex items-center justify-end gap-2 pt-4 mt-4 border-t border-secondary'>
									<button
										onClick={() => openEditModal(entity)}
										className='p-1.5 text-foreground-muted hover:text-foreground hover:bg-surface rounded-lg transition-colors cursor-pointer'
										title='Edit'>
										<Edit size={16} />
									</button>
									<button
										onClick={() => {
											if (confirm(`Are you sure you want to delete "${entity.name}"?`)) {
												onDelete(entity.id)
											}
										}}
										className='p-1.5 text-foreground-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer'
										title='Delete'>
										<Trash2 size={16} />
									</button>
								</div>
							</motion.div>
						))}
					</div>
				)}

				{/* Create/Edit Modal */}
				<AnimatePresence>
					{isModalOpen && (
						<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								className='bg-primary border border-secondary rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]'>
								<header className='flex items-center justify-between p-5 border-b border-secondary'>
									<h2 className='text-lg font-bold'>
										{editingEntity ? `Edit ${entityName}` : `New ${entityName}`}
									</h2>
									<button
										onClick={() => setIsModalOpen(false)}
										className='p-1.5 text-foreground-muted hover:text-foreground hover:bg-surface rounded-lg cursor-pointer'>
										<X size={18} />
									</button>
								</header>

								<form onSubmit={handleSubmit} className='p-5 space-y-4 overflow-y-auto'>
									{formError && (
										<div className='p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs'>
											{formError}
										</div>
									)}

									<div>
										<label className='block text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-1'>
											Name *
										</label>
										<input
											type='text'
											required
											placeholder='Company or Client Name'
											value={name}
											onChange={(e) => setName(e.target.value)}
											className='w-full bg-surface border border-secondary rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-emerald-500'
										/>
									</div>

									<div className='grid grid-cols-2 gap-3'>
										<div>
											<label className='block text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-1'>
												City / State / Zip
											</label>
											<input
												type='text'
												placeholder='Doral, FL 33172 US'
												value={city}
												onChange={(e) => setCity(e.target.value)}
												className='w-full bg-surface border border-secondary rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-emerald-500'
											/>
										</div>
										<div>
											<label className='block text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-1'>
												Phone
											</label>
											<input
												type='text'
												placeholder='+1 786 000 0000'
												value={phone}
												onChange={(e) => setPhone(e.target.value)}
												className='w-full bg-surface border border-secondary rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-emerald-500'
											/>
										</div>
									</div>

									<div className='grid grid-cols-2 gap-3'>
										<div>
											<label className='block text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-1'>
												Email
											</label>
											<input
												type='email'
												placeholder='operations@company.com'
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className='w-full bg-surface border border-secondary rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-emerald-500'
											/>
										</div>
										<div>
											<label className='block text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-1'>
												Website
											</label>
											<input
												type='text'
												placeholder='www.company.com'
												value={website}
												onChange={(e) => setWebsite(e.target.value)}
												className='w-full bg-surface border border-secondary rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-emerald-500'
											/>
										</div>
									</div>

									<div>
										<label className='block text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-1'>
											Street Address / Legal Details
										</label>
										<textarea
											rows={3}
											placeholder='2350 NW 93rd Ave...'
											value={address}
											onChange={(e) => setAddress(e.target.value)}
											className='w-full bg-surface border border-secondary rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-emerald-500 resize-y'
										/>
									</div>

									{/* Logo & Theme Color */}
									<div className='grid grid-cols-2 gap-3 pt-2'>
										<div>
											<label className='block text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-1 flex items-center gap-1.5'>
												<ImageIcon size={14} /> Logo
											</label>
											<div className='flex items-center gap-2'>
												{logoB64 && (
													// eslint-disable-next-line @next/next/no-img-element
													<img
														src={logoB64}
														alt='Preview'
														className='w-8 h-8 object-contain rounded border border-secondary bg-surface'
													/>
												)}
												<input
													type='file'
													accept='image/*'
													onChange={handleLogoUpload}
													className='text-xs text-foreground-muted file:py-1 file:px-2 file:rounded file:border-0 file:bg-surface file:text-foreground-muted file:cursor-pointer'
												/>
											</div>
										</div>

										<div>
											<label className='block text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-1 flex items-center gap-1.5'>
												<Palette size={14} /> Accent Color
											</label>
											<div className='flex items-center gap-2'>
												<input
													type='color'
													value={colorTheme}
													onChange={(e) => setColorTheme(e.target.value)}
													className='w-8 h-8 rounded border border-secondary bg-surface cursor-pointer'
												/>
												<span className='text-xs font-mono text-foreground-muted'>
													{colorTheme}
												</span>
											</div>
										</div>
									</div>

									{/* Footer buttons */}
									<div className='flex items-center justify-end gap-3 pt-5 border-t border-secondary'>
										<button
											type='button'
											onClick={() => setIsModalOpen(false)}
											className='px-4 py-2 text-sm text-foreground-muted hover:text-foreground cursor-pointer'>
											Cancel
										</button>
										<button
											type='submit'
											disabled={submitting}
											className='flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-2 px-5 rounded-lg text-sm transition-colors cursor-pointer'>
											{submitting ? (
												<>
													<Loader2 size={16} className='animate-spin' />
													Saving...
												</>
											) : (
												'Save Changes'
											)}
										</button>
									</div>
								</form>
							</motion.div>
						</div>
					)}
				</AnimatePresence>
			</div>
		</main>
	)
}

