'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	FileSpreadsheet,
	Upload,
	FileText,
	CheckCircle,
	AlertCircle,
	Loader2,
	Download,
	RefreshCw,
	ShieldCheck
} from 'lucide-react'
import { Api } from '@/util/api'

interface ProgressState {
	current: number
	total: number
	percentage: number
	message: string
}

export default function DocumentScannerPage() {
	const [invoiceFile, setInvoiceFile] = useState<File | null>(null)
	const [certFile, setCertFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)
	const [progress, setProgress] = useState<ProgressState | null>(null)
	const [isDone, setIsDone] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [jobId, setJobId] = useState<string | null>(null)
	const [rowCount, setRowCount] = useState<number | null>(null)

	const eventSourceRef = useRef<EventSource | null>(null)
	const invoiceInputRef = useRef<HTMLInputElement | null>(null)
	const certInputRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		return () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close()
			}
		}
	}, [])

	const handleConvert = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!invoiceFile) {
			setError('Please select an Invoice PDF file.')
			return
		}

		setError(null)
		setIsDone(false)
		setRowCount(null)
		setLoading(true)
		setProgress({ current: 0, total: 1, percentage: 0, message: 'Uploading document...' })

		const formData = new FormData()
		formData.append('invoice_file', invoiceFile)
		if (certFile) {
			formData.append('certificate_file', certFile)
		}

		try {
			const data = await Api.startPdfExtraction(formData)
			const currentJobId = data.job_id
			setJobId(currentJobId)

			const sse = new EventSource(Api.getPdfStreamUrl(currentJobId))
			eventSourceRef.current = sse

			sse.onmessage = (event) => {
				try {
					const msg = JSON.parse(event.data)
					if (msg.error) {
						setError(msg.error)
						setLoading(false)
						sse.close()
					} else if (msg.done) {
						setProgress({
							current: msg.rowCount || 1,
							total: msg.rowCount || 1,
							percentage: 100,
							message: 'Conversion completed successfully!'
						})
						setRowCount(msg.rowCount || 0)
						setIsDone(true)
						setLoading(false)
						sse.close()
					} else if (typeof msg.percentage === 'number') {
						setProgress({
							current: msg.current,
							total: msg.total,
							percentage: msg.percentage,
							message: msg.message || `Processing page ${msg.current} of ${msg.total}...`
						})
					}
				} catch {
					// Invalid SSE chunk
				}
			}

			sse.onerror = () => {
				sse.close()
				// Only treat as error if not marked done
				if (!isDone) {
					setError('Connection to conversion server lost. Please retry.')
					setLoading(false)
				}
			}
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Failed to initiate PDF conversion.')
			setLoading(false)
		}
	}

	const handleReset = () => {
		if (eventSourceRef.current) {
			eventSourceRef.current.close()
		}
		setInvoiceFile(null)
		setCertFile(null)
		setLoading(false)
		setProgress(null)
		setIsDone(false)
		setError(null)
		setJobId(null)
		setRowCount(null)
		if (invoiceInputRef.current) invoiceInputRef.current.value = ''
		if (certInputRef.current) certInputRef.current.value = ''
	}

	return (
		<main className='pl-24 pr-10 py-8 min-h-screen w-full bg-secondary text-foreground'>
			<div className='max-w-4xl mx-auto'>
				<header className='mb-8'>
					<div className='flex items-center gap-3'>
						<div className='p-3 bg-emerald-500/10 text-emerald-400 rounded-xl'>
							<FileSpreadsheet size={28} />
						</div>
						<div>
							<h1 className='text-2xl font-bold tracking-tight'>PDF to Excel Converter</h1>
							<p className='text-sm text-foreground-muted mt-0.5'>
								Extract items, products, lots, quantities, and dates from supplier invoice PDFs into Excel.
							</p>
						</div>
					</div>
				</header>

				<section className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Upload & Form Column */}
					<form onSubmit={handleConvert} className='lg:col-span-2 space-y-5'>
						{/* Invoice file card */}
						<div className='bg-primary border border-secondary rounded-xl p-5 shadow-sm'>
							<label className='block text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-2'>
								Invoice PDF (Required) *
							</label>
							<div
								onClick={() => invoiceInputRef.current?.click()}
								className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
									invoiceFile
										? 'border-emerald-500/50 bg-emerald-500/5'
										: 'border-secondary hover:border-emerald-500/40 hover:bg-surface'
								}`}>
								<input
									ref={invoiceInputRef}
									type='file'
									accept='.pdf,application/pdf'
									className='hidden'
									onChange={(e) => {
										const file = e.target.files?.[0]
										if (file) setInvoiceFile(file)
									}}
								/>
								<Upload
									size={32}
									className={`mx-auto mb-2 ${
										invoiceFile ? 'text-emerald-400' : 'text-foreground-muted'
									}`}
								/>
								{invoiceFile ? (
									<div>
										<p className='font-medium text-sm text-foreground'>{invoiceFile.name}</p>
										<p className='text-xs text-foreground-muted mt-1'>
											{(invoiceFile.size / 1024 / 1024).toFixed(2)} MB • Click to replace
										</p>
									</div>
								) : (
									<div>
										<p className='text-sm font-medium'>Drop invoice PDF here or click to browse</p>
										<p className='text-xs text-foreground-muted mt-1'>Supports supplier invoices and delivery bills</p>
									</div>
								)}
							</div>
						</div>

						{/* Certificate file card */}
						<div className='bg-primary border border-secondary rounded-xl p-5 shadow-sm'>
							<div className='flex items-center justify-between mb-2'>
								<label className='text-xs font-semibold text-foreground-muted uppercase tracking-wide'>
									Quality Certificate PDF (Optional)
								</label>
								<span className='text-[11px] text-foreground-muted flex items-center gap-1'>
									<ShieldCheck size={13} /> For lot manufacture dates
								</span>
							</div>
							<div
								onClick={() => certInputRef.current?.click()}
								className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all duration-200 ${
									certFile
										? 'border-blue-500/50 bg-blue-500/5'
										: 'border-secondary hover:border-blue-500/40 hover:bg-surface'
								}`}>
								<input
									ref={certInputRef}
									type='file'
									accept='.pdf,application/pdf'
									className='hidden'
									onChange={(e) => {
										const file = e.target.files?.[0]
										if (file) setCertFile(file)
									}}
								/>
								<FileText
									size={28}
									className={`mx-auto mb-2 ${
										certFile ? 'text-blue-400' : 'text-foreground-muted'
									}`}
								/>
								{certFile ? (
									<div>
										<p className='font-medium text-sm text-foreground'>{certFile.name}</p>
										<p className='text-xs text-foreground-muted mt-1'>
											{(certFile.size / 1024 / 1024).toFixed(2)} MB • Click to replace
										</p>
									</div>
								) : (
									<div>
										<p className='text-sm font-medium'>Drop certificate PDF here or click to browse</p>
										<p className='text-xs text-foreground-muted mt-1'>Matches lot codes to extract exact production dates</p>
									</div>
								)}
							</div>
						</div>

						{/* Actions */}
						<div className='flex items-center gap-3 pt-2'>
							<button
								type='submit'
								disabled={loading || !invoiceFile}
								className='flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium py-3 px-5 rounded-lg transition-colors cursor-pointer shadow-sm'>
								{loading ? (
									<>
										<Loader2 size={18} className='animate-spin' />
										Converting PDF...
									</>
								) : (
									<>
										<FileSpreadsheet size={18} />
										Convert to Excel (.xlsx)
									</>
								)}
							</button>

							{(invoiceFile || isDone || error) && (
								<button
									type='button'
									onClick={handleReset}
									disabled={loading}
									className='flex items-center gap-1.5 px-4 py-3 border border-secondary hover:bg-surface rounded-lg text-sm text-foreground-muted transition-colors cursor-pointer'>
									<RefreshCw size={16} />
									Reset
								</button>
							)}
						</div>
					</form>

					{/* Status & Results Column */}
					<div className='space-y-5'>
						<div className='bg-primary border border-secondary rounded-xl p-5 shadow-sm'>
							<h3 className='text-sm font-semibold tracking-wide uppercase text-foreground-muted mb-4'>
								Conversion Status
							</h3>

							<AnimatePresence mode='wait'>
								{error && (
									<motion.div
										initial={{ opacity: 0, y: 5 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0 }}
										className='p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-sm flex items-start gap-2.5'>
										<AlertCircle size={18} className='flex-shrink-0 mt-0.5' />
										<span>{error}</span>
									</motion.div>
								)}

								{loading && progress && (
									<motion.div
										initial={{ opacity: 0, y: 5 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0 }}
										className='space-y-3'>
										<div className='flex justify-between items-center text-xs'>
											<span className='text-foreground-muted'>{progress.message}</span>
											<span className='font-semibold text-emerald-400'>{progress.percentage}%</span>
										</div>
										<div className='w-full bg-surface rounded-full h-2 overflow-hidden'>
											<motion.div
												className='bg-emerald-500 h-full rounded-full'
												animate={{ width: `${progress.percentage}%` }}
												transition={{ duration: 0.3 }}
											/>
										</div>
										<p className='text-[11px] text-foreground-muted text-center pt-1'>
											Parsing invoice lines, quantities, and matching lot numbers...
										</p>
									</motion.div>
								)}

								{isDone && jobId && (
									<motion.div
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										className='space-y-4'>
										<div className='p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm flex items-start gap-2.5'>
											<CheckCircle size={18} className='flex-shrink-0 mt-0.5' />
											<div>
												<p className='font-medium'>Extraction Finished!</p>
												{rowCount !== null && (
													<p className='text-xs text-emerald-400/80 mt-1'>
														Successfully extracted {rowCount} item row{rowCount === 1 ? '' : 's'}.
													</p>
												)}
											</div>
										</div>

										<a
											href={Api.getPdfResultUrl(jobId)}
											download='extracted_data.xlsx'
											className='w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer shadow'>
											<Download size={18} />
											Download Excel Sheet
										</a>
									</motion.div>
								)}

								{!loading && !isDone && !error && (
									<div className='text-center py-8 text-foreground-muted'>
										<FileSpreadsheet size={36} className='mx-auto mb-2 opacity-40' />
										<p className='text-sm'>No document currently processing.</p>
										<p className='text-xs mt-1'>Upload a PDF invoice on the left to begin.</p>
									</div>
								)}
							</AnimatePresence>
						</div>

						{/* Helpful guide card */}
						<div className='bg-primary border border-secondary rounded-xl p-5 shadow-sm text-xs text-foreground-muted space-y-2.5'>
							<p className='font-semibold text-foreground uppercase tracking-wider text-[11px]'>
								Quick Tip
							</p>
							<p>
								The generated Excel sheet is formatted ready to be imported directly into QBFlow&apos;s <strong>Document Generator</strong> to create packing slips and invoices.
							</p>
						</div>
					</div>
				</section>
			</div>
		</main>
	)
}

