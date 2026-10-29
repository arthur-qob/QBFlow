'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Users as UsersIcon,
	Search,
	Edit,
	Trash2,
	Mail,
	User,
	X,
	Loader2,
	ShieldCheck
} from 'lucide-react'
import { UsersApi } from '@/util/api'
import type { AppUser } from '@/util/types'

export default function UsersPage() {
	const [users, setUsers] = useState<AppUser[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [search, setSearch] = useState('')

	const [editingUser, setEditingUser] = useState<AppUser | null>(null)
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [submitting, setSubmitting] = useState(false)
	const [formError, setFormError] = useState<string | null>(null)

	const loadUsers = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			const list = await UsersApi.list()
			setUsers(list)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Failed to fetch users.')
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		loadUsers()
	}, [loadUsers])

	const openEdit = (u: AppUser) => {
		setEditingUser(u)
		setFirstName(u.first_name || '')
		setLastName(u.last_name || '')
		setEmail(u.email || '')
		setFormError(null)
	}

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!editingUser) return

		setSubmitting(true)
		setFormError(null)
		try {
			await UsersApi.update(editingUser.id, {
				first_name: firstName.trim(),
				last_name: lastName.trim(),
				email: email.trim()
			})
			setEditingUser(null)
			await loadUsers()
		} catch (err: unknown) {
			setFormError(err instanceof Error ? err.message : 'Failed to update user.')
		} finally {
			setSubmitting(false)
		}
	}

	const handleDelete = async (id: string, name: string) => {
		if (confirm(`Are you sure you want to delete user "${name}"?`)) {
			try {
				await UsersApi.delete(id)
				await loadUsers()
			} catch (err: unknown) {
				alert(err instanceof Error ? err.message : 'Failed to delete user.')
			}
		}
	}

	const filtered = users.filter((u) =>
		[u.first_name, u.last_name, u.email].some((v) =>
			(v || '').toLowerCase().includes(search.toLowerCase())
		)
	)

	return (
		<main className='pl-24 pr-10 py-8 min-h-screen w-full bg-secondary text-foreground'>
			<div className='max-w-6xl mx-auto'>
				<header className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
					<div>
						<h1 className='text-2xl font-bold tracking-tight'>Team & Users</h1>
						<p className='text-sm text-foreground-muted mt-0.5'>
							Manage platform accounts, authentication profiles and member permissions.
						</p>
					</div>
				</header>

				{/* Search bar */}
				<div className='flex items-center justify-between gap-4 mb-6 bg-primary border border-secondary rounded-xl p-3 shadow-sm'>
					<div className='relative flex-1 max-w-md'>
						<Search
							size={16}
							className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted'
						/>
						<input
							type='text'
							placeholder='Search users by name or email...'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className='w-full bg-surface border border-secondary rounded-lg pl-9 pr-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-emerald-500'
						/>
					</div>
					<span className='text-xs text-foreground-muted font-medium pr-2'>
						{filtered.length} {filtered.length === 1 ? 'User' : 'Users'}
					</span>
				</div>

				{/* Error */}
				{error && (
					<div className='p-4 mb-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm'>
						{error}
					</div>
				)}

				{/* List */}
				{loading ? (
					<div className='flex items-center justify-center py-20 text-foreground-muted'>
						<Loader2 size={32} className='animate-spin text-emerald-400' />
					</div>
				) : filtered.length === 0 ? (
					<div className='text-center py-20 bg-primary border border-secondary rounded-xl'>
						<UsersIcon size={40} className='mx-auto mb-3 opacity-30 text-foreground-muted' />
						<h3 className='font-semibold text-foreground text-base'>No users found</h3>
						<p className='text-xs text-foreground-muted mt-1 max-w-sm mx-auto'>
							Users automatically register upon sign-in with Google/Firebase.
						</p>
					</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
						{filtered.map((user) => {
							const fullName = `${user.first_name} ${user.last_name}`.trim() || 'Anonymous User'
							return (
								<motion.div
									key={user.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className='bg-primary border border-secondary rounded-xl p-5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between'>
									<div>
										<div className='flex items-center gap-3 mb-4'>
											{user.avatar_url ? (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													src={user.avatar_url}
													alt={fullName}
													className='w-11 h-11 rounded-full object-cover border border-secondary'
												/>
											) : (
												<div className='w-11 h-11 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/30'>
													{fullName.charAt(0).toUpperCase()}
												</div>
											)}
											<div className='truncate'>
												<h3 className='font-semibold text-foreground text-sm truncate'>
													{fullName}
												</h3>
												<p className='text-xs text-foreground-muted flex items-center gap-1 mt-0.5 truncate'>
													<Mail size={12} className='flex-shrink-0' /> {user.email || 'No email'}
												</p>
											</div>
										</div>

										<div className='text-[11px] text-foreground-muted space-y-1 pt-2 border-t border-secondary font-mono'>
											<p className='truncate'>UID: {user.id}</p>
											{user.created_at && (
												<p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
											)}
										</div>
									</div>

									<div className='flex items-center justify-end gap-2 pt-4 mt-4 border-t border-secondary'>
										<button
											onClick={() => openEdit(user)}
											className='p-1.5 text-foreground-muted hover:text-foreground hover:bg-surface rounded-lg transition-colors cursor-pointer'
											title='Edit user'>
											<Edit size={16} />
										</button>
										<button
											onClick={() => handleDelete(user.id, fullName)}
											className='p-1.5 text-foreground-muted hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer'
											title='Delete user'>
											<Trash2 size={16} />
										</button>
									</div>
								</motion.div>
							)
						})}
					</div>
				)}

				{/* Edit User Modal */}
				<AnimatePresence>
					{editingUser && (
						<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								className='bg-primary border border-secondary rounded-2xl w-full max-w-md shadow-xl overflow-hidden'>
								<header className='flex items-center justify-between p-5 border-b border-secondary'>
									<h2 className='text-lg font-bold'>Edit User Profile</h2>
									<button
										onClick={() => setEditingUser(null)}
										className='p-1.5 text-foreground-muted hover:text-foreground hover:bg-surface rounded-lg cursor-pointer'>
										<X size={18} />
									</button>
								</header>

								<form onSubmit={handleUpdate} className='p-5 space-y-4'>
									{formError && (
										<div className='p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs'>
											{formError}
										</div>
									)}

									<div>
										<label className='block text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-1'>
											First Name
										</label>
										<input
											type='text'
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											className='w-full bg-surface border border-secondary rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-emerald-500'
										/>
									</div>

									<div>
										<label className='block text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-1'>
											Last Name
										</label>
										<input
											type='text'
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											className='w-full bg-surface border border-secondary rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-emerald-500'
										/>
									</div>

									<div>
										<label className='block text-xs font-semibold uppercase tracking-wider text-foreground-muted mb-1'>
											Email Address
										</label>
										<input
											type='email'
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className='w-full bg-surface border border-secondary rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-emerald-500'
										/>
									</div>

									<div className='flex items-center justify-end gap-3 pt-4 border-t border-secondary'>
										<button
											type='button'
											onClick={() => setEditingUser(null)}
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

