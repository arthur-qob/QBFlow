'use client'

import { Api as api } from '@/util/api'
import { useState, useRef, useCallback } from 'react'

const inputClass =
	'bg-surface border border-secondary rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted outline-none focus:ring-1 focus:ring-[rgb(91,239,118)] w-full transition-all duration-200'
const textareaClass = `${inputClass} resize-y min-h-24`
const labelClass =
	'text-xs font-semibold text-foreground-muted uppercase tracking-wide'

const DEFAULT_ADDRESS = `BCR COM E DIST DE IMPLANTES\nCIRURGICOS LTDA\nRUA PAULO BLASCHKE 270 JARDIM\nITU\nPORTO ALEGRE\nRIO GRANDE DO SUL\nCEP 91225-230\nCNPJ: 17.958.615/0001-28`

const DocumentGenerator = () => {
	const [excelFile, setExcelFile] = useState<File | null>(null)
	const [logoFile, setLogoFile] = useState<File | null>(null)
	const [excelDragging, setExcelDragging] = useState(false)
	const [logoDragging, setLogoDragging] = useState(false)

	const [companyName, setCompanyName] = useState('TECHNICARE USA LLC')
	const [companyAddress, setCompanyAddress] = useState('2350 NW 93rd Ave')
	const [companyCity, setCompanyCity] = useState('Doral, FL 33172 US')
	const [companyPhone, setCompanyPhone] = useState('+17867475565')
	const [companyEmail, setCompanyEmail] = useState(
		'operations@technicareusa.com'
	)
	const [companyWebsite, setCompanyWebsite] = useState(
		'www.technicareusa.com'
	)

	const [billTo, setBillTo] = useState(DEFAULT_ADDRESS)
	const [shipTo, setShipTo] = useState(DEFAULT_ADDRESS)

	const [invoiceNumber, setInvoiceNumber] = useState('022-26')
	const [invoiceDate, setInvoiceDate] = useState(
		() => new Date().toISOString().split('T')[0]
	)
	const [incoterm, setIncoterm] = useState('CPT')
	const [terms, setTerms] = useState('')
	const [packingInfo, setPackingInfo] = useState('1 parcel | 60 x 40 x 42 cm')
	const [dateFormat, setDateFormat] = useState('day_month_year')

	const [netWeight, setNetWeight] = useState('9.00 kg')
	const [grossWeight, setGrossWeight] = useState('10.60 kg')

	const [showNetWeight, setShowNetWeight] = useState(false)
	const [showWarehouseReceipt, setShowWarehouseReceipt] = useState(false)
	const [warehouseReceipt, setWarehouseReceipt] = useState('')

	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const excelInputRef = useRef<HTMLInputElement>(null)
	const logoInputRef = useRef<HTMLInputElement>(null)

	const handleExcelDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setExcelDragging(false)
		const file = e.dataTransfer.files[0]
		if (file) setExcelFile(file)
	}, [])

	const handleLogoDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		setLogoDragging(false)
		const file = e.dataTransfer.files[0]
		if (file) setLogoFile(file)
	}, [])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!excelFile) {
			setError('Please select an Excel file')
			return
		}
		setError('')
		setLoading(true)

		const formData = new FormData()
		formData.append('excel_file', excelFile)
		if (logoFile) formData.append('logo_file', logoFile)

		const fields: Record<string, string> = {
			company_name: companyName,
			company_address: companyAddress,
			company_city: companyCity,
			company_phone: companyPhone,
			company_email: companyEmail,
			company_website: companyWebsite,
			bill_to: billTo,
			ship_to: shipTo,
			invoice_number: invoiceNumber,
			invoice_date: invoiceDate,
			incoterm: incoterm,
			terms: terms,
			packing_info: packingInfo,
			date_format: dateFormat,
			net_weight: netWeight,
			gross_weight: grossWeight,
		}
		Object.entries(fields).forEach(([k, v]) => formData.append(k, v))

		if (showNetWeight) formData.append('show_net_weight', 'on')
		if (showWarehouseReceipt) {
			formData.append('show_warehouse_receipt', 'on')
			formData.append('warehouse_receipt', warehouseReceipt)
		}

		try {
			const res = await api.generatePackingSlip(formData)

			const blob = await res.blob()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `Packing Slip ${formData.get('invoice_number')}.pdf`
			document.body.appendChild(a)
			a.click()
			window.URL.revokeObjectURL(url)
			a.remove()
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'An error occurred')
		} finally {
			setLoading(false)
		}

		try {
			const response = await fetch('/generate', {
				method: 'POST',
				body: formData
			})
			if (!response.ok) throw new Error(await response.text())
			const blob = await response.blob()
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `Packing Slip ${formData.get('invoice_number')}.pdf`
			document.body.appendChild(a)
			a.click()
			window.URL.revokeObjectURL(url)
			a.remove()
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'An error occurred')
		} finally {
			setLoading(false)
		}
	}

	const handleReset = () => {
		setExcelFile(null)
		setLogoFile(null)
		setCompanyName('TECHNICARE USA LLC')
		setCompanyAddress('2350 NW 93rd Ave')
		setCompanyCity('Doral, FL 33172 US')
		setCompanyPhone('+17867475565')
		setCompanyEmail('operations@technicareusa.com')
		setCompanyWebsite('www.technicareusa.com')
		setBillTo(DEFAULT_ADDRESS)
		setShipTo(DEFAULT_ADDRESS)
		setInvoiceNumber('022-26')
		setInvoiceDate(new Date().toISOString().split('T')[0])
		setIncoterm('CPT')
		setTerms('')
		setPackingInfo('1 parcel | 60 x 40 x 42 cm')
		setDateFormat('day_month_year')
		setNetWeight('9.00 kg')
		setGrossWeight('10.60 kg')
		setShowNetWeight(false)
		setShowWarehouseReceipt(false)
		setWarehouseReceipt('')
		setError('')
	}

	return (
		<main className='bg-secondary text-foreground px-20 py-8 h-full w-full'>
			{/* Document type selector */}
			<div className='w-50 flex flex-row justify-between items-center'>
				<div className='flex flex-row items-center gap-2'>
					<input
						type='radio'
						name='doc_type'
						id='packing_slip'
						defaultChecked
					/>
					<label htmlFor='packing_slip'>Packing Slip</label>
				</div>
				<div className='flex flex-row items-center gap-2'>
					<input
						type='radio'
						name='doc_type'
						id='invoice'
						disabled
					/>
					<label
						className='text-gray-400'
						htmlFor='invoice'>
						Invoice
					</label>
				</div>
			</div>

			{/* Packing Slip Form */}
			<form
				onSubmit={handleSubmit}
				className='flex flex-col gap-8'>
				{/* File Uploads */}
				<div className='flex flex-col gap-3'>
					<input
						ref={excelInputRef}
						type='file'
						accept='.xlsx,.xls'
						className='hidden'
						onChange={(e) =>
							setExcelFile(e.target.files?.[0] ?? null)
						}
					/>
					<button
						type='button'
						onClick={() => excelInputRef.current?.click()}
						onDragOver={(e) => {
							e.preventDefault()
							setExcelDragging(true)
						}}
						onDragLeave={() => setExcelDragging(false)}
						onDrop={handleExcelDrop}
						className={`w-full border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
							excelFile
								? 'border-[rgb(91,239,118)] bg-[rgb(91,239,118)]/5'
								: excelDragging
									? 'border-[rgb(91,239,214)] bg-[rgb(91,239,214)]/5'
									: 'border-secondary hover:border-[rgb(91,239,118)] hover:bg-[rgb(91,239,118)]/5'
						}`}>
						<p className='text-2xl mb-2'>📄</p>
						{excelFile ? (
							<p className='text-sm font-semibold text-[rgb(91,239,118)]'>
								✓ {excelFile.name}
							</p>
						) : (
							<>
								<p className='text-sm text-foreground'>
									Click to upload or drag and drop
								</p>
								<p className='text-xs text-foreground-muted mt-1'>
									Excel file (.xlsx)
								</p>
							</>
						)}
					</button>
					{error && !excelFile && (
						<p className='text-xs text-red-500'>{error}</p>
					)}

					<input
						ref={logoInputRef}
						type='file'
						accept='image/*'
						className='hidden'
						onChange={(e) =>
							setLogoFile(e.target.files?.[0] ?? null)
						}
					/>
					<button
						type='button'
						onClick={() => logoInputRef.current?.click()}
						onDragOver={(e) => {
							e.preventDefault()
							setLogoDragging(true)
						}}
						onDragLeave={() => setLogoDragging(false)}
						onDrop={handleLogoDrop}
						className={`w-full border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
							logoFile
								? 'border-[rgb(91,239,118)] bg-[rgb(91,239,118)]/5'
								: logoDragging
									? 'border-[rgb(91,239,214)] bg-[rgb(91,239,214)]/5'
									: 'border-secondary hover:border-[rgb(91,239,118)] hover:bg-[rgb(91,239,118)]/5'
						}`}>
						<p className='text-2xl mb-2'>🖼️</p>
						{logoFile ? (
							<p className='text-sm font-semibold text-[rgb(91,239,118)]'>
								✓ {logoFile.name}
							</p>
						) : (
							<>
								<p className='text-sm text-foreground'>
									Click to upload logo or drag and drop
								</p>
								<p className='text-xs text-foreground-muted mt-1'>
									Image file (PNG, JPG, SVG)
								</p>
							</>
						)}
					</button>
				</div>

				{/* Company Information */}
				<section className='flex flex-col gap-4'>
					<h2 className='text-sm font-semibold text-foreground border-b border-secondary pb-2'>
						Company Information
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						<div className='flex flex-col gap-1.5'>
							<label className={labelClass}>Company Name</label>
							<input
								className={inputClass}
								type='text'
								value={companyName}
								onChange={(e) => setCompanyName(e.target.value)}
								required
							/>
						</div>
						<div className='flex flex-col gap-1.5'>
							<label className={labelClass}>Address</label>
							<input
								className={inputClass}
								type='text'
								value={companyAddress}
								onChange={(e) =>
									setCompanyAddress(e.target.value)
								}
								required
							/>
						</div>
						<div className='flex flex-col gap-1.5'>
							<label className={labelClass}>
								City / State / Zip
							</label>
							<input
								className={inputClass}
								type='text'
								value={companyCity}
								onChange={(e) => setCompanyCity(e.target.value)}
								required
							/>
						</div>
						<div className='flex flex-col gap-1.5'>
							<label className={labelClass}>Phone</label>
							<input
								className={inputClass}
								type='text'
								value={companyPhone}
								onChange={(e) =>
									setCompanyPhone(e.target.value)
								}
								required
							/>
						</div>
						<div className='flex flex-col gap-1.5'>
							<label className={labelClass}>Email</label>
							<input
								className={inputClass}
								type='text'
								value={companyEmail}
								onChange={(e) =>
									setCompanyEmail(e.target.value)
								}
								required
							/>
						</div>
						<div className='flex flex-col gap-1.5'>
							<label className={labelClass}>Website</label>
							<input
								className={inputClass}
								type='text'
								value={companyWebsite}
								onChange={(e) =>
									setCompanyWebsite(e.target.value)
								}
								required
							/>
						</div>
					</div>
				</section>

				{/* Bill To / Ship To */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
					<section className='flex flex-col gap-4'>
						<h2 className='text-sm font-semibold text-foreground border-b border-secondary pb-2'>
							Bill To
						</h2>
						<div className='flex flex-col gap-1.5'>
							<label className={labelClass}>
								Company Details
							</label>
							<textarea
								className={textareaClass}
								value={billTo}
								onChange={(e) => setBillTo(e.target.value)}
								required
							/>
						</div>
					</section>
					<section className='flex flex-col gap-4'>
						<h2 className='text-sm font-semibold text-foreground border-b border-secondary pb-2'>
							Ship To
						</h2>
						<div className='flex flex-col gap-1.5'>
							<label className={labelClass}>
								Company Details
							</label>
							<textarea
								className={textareaClass}
								value={shipTo}
								onChange={(e) => setShipTo(e.target.value)}
								required
							/>
						</div>
					</section>
				</div>

				{/* Document Information */}
				<section className='flex flex-col gap-4'>
					<h2 className='text-sm font-semibold text-foreground border-b border-secondary pb-2'>
						Document Information
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
						<div className='flex flex-col gap-1.5'>
							<label className={labelClass}>Invoice Number</label>
							<input
								className={inputClass}
								type='text'
								value={invoiceNumber}
								onChange={(e) =>
									setInvoiceNumber(e.target.value)
								}
								required
							/>
						</div>
						<div className='flex flex-col gap-1.5'>
							<label className={labelClass}>Invoice Date</label>
							<input
								className={inputClass}
								type='date'
								value={invoiceDate}
								onChange={(e) => setInvoiceDate(e.target.value)}
								required
							/>
						</div>
						<div className='flex flex-col gap-1.5'>
							<label className={labelClass}>Incoterm</label>
							<input
								className={inputClass}
								type='text'
								value={incoterm}
								onChange={(e) => setIncoterm(e.target.value)}
								required
							/>
						</div>
						<div className='flex flex-col gap-1.5'>
							<label className={labelClass}>Terms</label>
							<input
								className={inputClass}
								type='text'
								value={terms}
								onChange={(e) => setTerms(e.target.value)}
								placeholder='e.g. Net 30'
							/>
						</div>
						<div className='flex flex-col gap-1.5 md:col-span-2'>
							<label className={labelClass}>
								Packing Information
							</label>
							<textarea
								className={textareaClass}
								value={packingInfo}
								onChange={(e) => setPackingInfo(e.target.value)}
								required
							/>
						</div>
					</div>
					<div className='flex flex-col gap-2'>
						<label className={labelClass}>
							Manufacture Date Format
						</label>
						<div className='flex gap-6'>
							<label className='flex items-center gap-2 cursor-pointer'>
								<input
									type='radio'
									name='date_format'
									value='day_month_year'
									checked={dateFormat === 'day_month_year'}
									onChange={() =>
										setDateFormat('day_month_year')
									}
									className='accent-[rgb(91,239,118)]'
								/>
								<span className='text-sm text-foreground'>
									Day / Month / Year
								</span>
							</label>
							<label className='flex items-center gap-2 cursor-pointer'>
								<input
									type='radio'
									name='date_format'
									value='month_year'
									checked={dateFormat === 'month_year'}
									onChange={() => setDateFormat('month_year')}
									className='accent-[rgb(91,239,118)]'
								/>
								<span className='text-sm text-foreground'>
									Month / Year only
								</span>
							</label>
						</div>
					</div>
				</section>

				{/* Weight Information */}
				<section className='flex flex-col gap-4'>
					<h2 className='text-sm font-semibold text-foreground border-b border-secondary pb-2'>
						Weight Information
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='flex flex-col gap-1.5'>
							<label className={labelClass}>Net Weight</label>
							<input
								className={inputClass}
								type='text'
								value={netWeight}
								onChange={(e) => setNetWeight(e.target.value)}
								required
							/>
						</div>
						<div className='flex flex-col gap-1.5'>
							<label className={labelClass}>Gross Weight</label>
							<input
								className={inputClass}
								type='text'
								value={grossWeight}
								onChange={(e) => setGrossWeight(e.target.value)}
								required
							/>
						</div>
					</div>
				</section>

				{/* Optional Fields */}
				<section className='flex flex-col'>
					<h2 className='text-sm font-semibold text-foreground border-b border-secondary pb-2 mb-0'>
						Optional Fields
					</h2>

					<div className='flex items-center gap-3 py-3 border-b border-secondary'>
						<button
							type='button'
							role='switch'
							aria-checked={showNetWeight}
							onClick={() => setShowNetWeight((v) => !v)}
							className={`relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${showNetWeight ? 'bg-[rgb(91,239,118)]' : 'bg-secondary'}`}>
							<span
								className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${showNetWeight ? 'translate-x-4' : 'translate-x-0'}`}
							/>
						</button>
						<span className={labelClass}>
							Show NET WEIGHT column in items table
						</span>
					</div>

					<div className='flex flex-col'>
						<div className='flex items-center gap-3 py-3'>
							<button
								type='button'
								role='switch'
								aria-checked={showWarehouseReceipt}
								onClick={() => {
									setShowWarehouseReceipt((v) => !v)
									if (showWarehouseReceipt)
										setWarehouseReceipt('')
								}}
								className={`relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${showWarehouseReceipt ? 'bg-[rgb(91,239,118)]' : 'bg-secondary'}`}>
								<span
									className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${showWarehouseReceipt ? 'translate-x-4' : 'translate-x-0'}`}
								/>
							</button>
							<span className={labelClass}>
								Show Warehouse Receipt Number
							</span>
						</div>
						{showWarehouseReceipt && (
							<div className='flex flex-col gap-1.5 pl-13 pb-3'>
								<label className={labelClass}>
									Warehouse Receipt Number
								</label>
								<input
									className={inputClass}
									type='text'
									value={warehouseReceipt}
									onChange={(e) =>
										setWarehouseReceipt(e.target.value)
									}
									placeholder='e.g. WR-2026-001'
								/>
							</div>
						)}
					</div>
				</section>

				{error && excelFile && (
					<p className='text-sm text-red-500'>{error}</p>
				)}

				{/* Actions */}
				<div className='flex gap-3 pt-4 border-t border-secondary'>
					<button
						type='button'
						onClick={handleReset}
						className='flex-1 px-4 py-3 rounded-lg text-sm font-semibold text-foreground-muted bg-surface border border-secondary hover:bg-surface-hover transition-all duration-200'>
						Reset Form
					</button>
					<button
						type='submit'
						disabled={loading}
						className='flex-1 px-4 py-3 rounded-lg text-sm font-semibold text-black bg-[rgb(91,239,118)] hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'>
						{loading ? 'Generating...' : 'Generate Packing Slip'}
					</button>
				</div>
			</form>
		</main>
	)
}

export default DocumentGenerator
