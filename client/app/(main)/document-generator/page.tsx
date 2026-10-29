'use client'

import { Api as api } from '@/util/api'
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Building2,
	Calendar,
	CalendarDays,
	Check,
	ChevronDown,
	Copy,
	CreditCard,
	FileText,
	Globe,
	MapPin,
	PenLine,
	Receipt
} from 'lucide-react'

const inputClass =
	'bg-surface border border-secondary rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted outline-none focus:ring-1 focus:ring-[rgb(91,239,118)] w-full transition-all duration-200'
const textareaClass = `${inputClass} resize-y min-h-24`
const labelClass =
	'text-xs font-semibold text-foreground-muted uppercase tracking-wide'

const DEFAULT_ADDRESS = `BCR COM E DIST DE IMPLANTES\nCIRURGICOS LTDA\nRUA PAULO BLASCHKE 270 JARDIM\nITU\nPORTO ALEGRE\nRIO GRANDE DO SUL\nCEP 91225-230\nCNPJ: 17.958.615/0001-28`

interface CompanyPreset {
	id: string
	displayName: string
	name: string
	address: string
	city: string
	phone: string
	email: string
	website: string
}

const COMPANY_PRESETS: CompanyPreset[] = [
	{
		id: 'technicare',
		displayName: 'Technicare USA',
		name: 'TECHNICARE USA LLC',
		address: '2350 NW 93rd Ave',
		city: 'Doral, FL 33172 US',
		phone: '+17867475565',
		email: 'operations@technicareusa.com',
		website: 'www.technicareusa.com'
	},
	{
		id: 'rutala',
		displayName: 'Ruta LA',
		name: 'RUTA LA',
		address: '2350 NW 93rd Ave',
		city: 'Doral, FL 33172 US',
		phone: '+17867475565',
		email: 'operations@rutala.com',
		website: 'www.rutala.com'
	}
]

interface TermsPreset {
	label: string
	value: string
	description?: string
}

const TERMS_PRESETS: TermsPreset[] = [
	{
		label: 'Due on Receipt',
		value: 'Due on Receipt',
		description: 'Due immediately upon receipt'
	},
	{ label: 'Net 15', value: 'Net 15', description: 'Payment due in 15 days' },
	{ label: 'Net 30', value: 'Net 30', description: 'Payment due in 30 days' },
	{ label: 'Net 60', value: 'Net 60', description: 'Payment due in 60 days' },
	{
		label: 'Advance Payment',
		value: 'Advanced',
		description: 'Payment before shipment'
	},
	{
		label: 'Prepaid',
		value: 'Prepaid',
		description: 'Fully paid in advance'
	},
	{ label: 'None', value: '', description: 'Leave terms blank' }
]

interface IncotermPreset {
	code: string
	name: string
	description?: string
}

const INCOTERM_PRESETS: IncotermPreset[] = [
	{
		code: 'CPT',
		name: 'Carriage Paid To',
		description: 'Seller pays freight to destination'
	},
	{
		code: 'FOB',
		name: 'Free On Board',
		description: 'Buyer takes over once loaded on vessel'
	},
	{
		code: 'EXW',
		name: 'Ex Works',
		description: 'Buyer assumes all delivery risk & costs'
	},
	{
		code: 'CIF',
		name: 'Cost, Insurance & Freight',
		description: 'Seller pays ocean freight and insurance'
	},
	{
		code: 'CIP',
		name: 'Carriage & Insurance Paid',
		description: 'Seller pays transport & insurance'
	},
	{
		code: 'DAP',
		name: 'Delivered At Place',
		description: 'Seller delivers to named place'
	},
	{
		code: 'DDP',
		name: 'Delivered Duty Paid',
		description: 'Seller handles all costs including import duty'
	},
	{
		code: 'FCA',
		name: 'Free Carrier',
		description: 'Seller delivers goods to named carrier'
	},
	{
		code: 'CFR',
		name: 'Cost and Freight',
		description: 'Seller pays freight to destination port'
	}
]

interface AddressPreset {
	id: string
	displayName: string
	name: string
	address: string
	description?: string
}

const ADDRESS_PRESETS: AddressPreset[] = [
	{
		id: 'bcr',
		displayName: 'BCR Implantes',
		name: 'BCR COM E DIST DE IMPLANTES CIRURGICOS LTDA',
		description: 'Porto Alegre, RS - Brazil',
		address: DEFAULT_ADDRESS
	},
	{
		id: 'technicare',
		displayName: 'Technicare USA',
		name: 'TECHNICARE USA LLC',
		description: 'Doral, FL - United States',
		address: `TECHNICARE USA LLC\n2350 NW 93rd Ave\nDoral, FL 33172 US\nTel: +17867475565\noperations@technicareusa.com`
	},
	{
		id: 'rutala',
		displayName: 'Ruta LA',
		name: 'RUTA LA',
		description: 'Doral, FL - United States',
		address: `RUTA LA\n2350 NW 93rd Ave\nDoral, FL 33172 US\nTel: +17867475565\noperations@rutala.com`
	}
]

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
	const [docType, setDocType] = useState<'packing_slip' | 'invoice'>(
		'packing_slip'
	)

	const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false)
	const [isCustomCompany, setIsCustomCompany] = useState(false)
	const companyDropdownRef = useRef<HTMLDivElement>(null)

	const [termsDropdownOpen, setTermsDropdownOpen] = useState(false)
	const [isCustomTerms, setIsCustomTerms] = useState(false)
	const termsDropdownRef = useRef<HTMLDivElement>(null)

	const [incotermDropdownOpen, setIncotermDropdownOpen] = useState(false)
	const [isCustomIncoterm, setIsCustomIncoterm] = useState(false)
	const incotermDropdownRef = useRef<HTMLDivElement>(null)

	const [billToDropdownOpen, setBillToDropdownOpen] = useState(false)
	const billToDropdownRef = useRef<HTMLDivElement>(null)

	const [shipToDropdownOpen, setShipToDropdownOpen] = useState(false)
	const shipToDropdownRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node
			if (
				companyDropdownRef.current &&
				!companyDropdownRef.current.contains(target)
			) {
				setCompanyDropdownOpen(false)
			}
			if (
				termsDropdownRef.current &&
				!termsDropdownRef.current.contains(target)
			) {
				setTermsDropdownOpen(false)
			}
			if (
				incotermDropdownRef.current &&
				!incotermDropdownRef.current.contains(target)
			) {
				setIncotermDropdownOpen(false)
			}
			if (
				billToDropdownRef.current &&
				!billToDropdownRef.current.contains(target)
			) {
				setBillToDropdownOpen(false)
			}
			if (
				shipToDropdownRef.current &&
				!shipToDropdownRef.current.contains(target)
			) {
				setShipToDropdownOpen(false)
			}
		}

		if (
			companyDropdownOpen ||
			termsDropdownOpen ||
			incotermDropdownOpen ||
			billToDropdownOpen ||
			shipToDropdownOpen
		) {
			document.addEventListener('mousedown', handleClickOutside)
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [
		companyDropdownOpen,
		termsDropdownOpen,
		incotermDropdownOpen,
		billToDropdownOpen,
		shipToDropdownOpen
	])

	const handleSelectCompany = (preset: CompanyPreset) => {
		setCompanyName(preset.name)
		setCompanyAddress(preset.address)
		setCompanyCity(preset.city)
		setCompanyPhone(preset.phone)
		setCompanyEmail(preset.email)
		setCompanyWebsite(preset.website)
		setCompanyDropdownOpen(false)
	}

	const handleSelectTerms = (val: string) => {
		setTerms(val)
		setTermsDropdownOpen(false)
	}

	const handleSelectIncoterm = (code: string) => {
		setIncoterm(code)
		setIncotermDropdownOpen(false)
	}

	const selectedIncotermPreset = INCOTERM_PRESETS.find(
		(p) => p.code === incoterm
	)

	const selectedBillToPreset = ADDRESS_PRESETS.find(
		(p) => p.address.trim() === billTo.trim()
	)

	const selectedShipToPreset = ADDRESS_PRESETS.find(
		(p) => p.address.trim() === shipTo.trim()
	)

	const selectedPreset = COMPANY_PRESETS.find(
		(p) => p.name === companyName || p.displayName === companyName
	)

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
			gross_weight: grossWeight
		}
		Object.entries(fields).forEach(([k, v]) => formData.append(k, v))

		if (showNetWeight) formData.append('show_net_weight', 'on')

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
		setDocType('packing_slip')
		setCompanyDropdownOpen(false)
		setIsCustomCompany(false)
		setTermsDropdownOpen(false)
		setIsCustomTerms(false)
		setIncotermDropdownOpen(false)
		setIsCustomIncoterm(false)
		setBillToDropdownOpen(false)
		setShipToDropdownOpen(false)
		setError('')
	}

	return (
		<main className='bg-secondary text-foreground pl-25 pr-10 py-8 h-full w-full'>
			{/* Document type selector */}
			<div className='flex flex-col gap-2 mb-6'>
				<span className={labelClass}>Document Type</span>
				<div className='inline-flex p-1 bg-surface border border-secondary rounded-xl shadow-xs gap-1.5 w-fit'>
					{/* Packing Slip */}
					<label
						translate='no'
						htmlFor='packing_slip'
						className={`group relative flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
							docType === 'packing_slip'
								? 'bg-primary text-foreground shadow-xs border border-secondary/80'
								: 'text-foreground-muted hover:text-foreground hover:bg-surface-hover/50 border border-transparent'
						}`}>
						<input
							type='radio'
							name='doc_type'
							id='packing_slip'
							value='packing_slip'
							checked={docType === 'packing_slip'}
							onChange={() => setDocType('packing_slip')}
							className='sr-only peer'
						/>
						{/* Custom radio circle indicator */}
						<div
							className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
								docType === 'packing_slip'
									? 'border-[rgb(91,239,118)] bg-[rgb(91,239,118)]/10'
									: 'border-secondary group-hover:border-foreground-muted'
							}`}>
							{docType === 'packing_slip' && (
								<div className='w-2 h-2 rounded-full bg-[rgb(91,239,118)] shadow-[0_0_8px_rgba(91,239,118,0.7)]' />
							)}
						</div>
						<FileText
							size={16}
							className={`transition-colors duration-200 ${
								docType === 'packing_slip'
									? 'text-[rgb(91,239,118)]'
									: 'text-foreground-muted'
							}`}
						/>
						<span>Packing Slip</span>
					</label>

					{/* Invoice */}
					<label
						translate='no'
						htmlFor='invoice'
						className='relative flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 select-none opacity-50 cursor-not-allowed border border-transparent'>
						<input
							type='radio'
							name='doc_type'
							id='invoice'
							value='invoice'
							disabled
							className='sr-only'
						/>
						{/* Custom radio circle indicator (disabled) */}
						<div className='w-4 h-4 rounded-full border-2 border-secondary flex items-center justify-center' />
						<Receipt
							size={16}
							className='text-foreground-muted'
						/>
						<span className='text-foreground-muted'>Invoice</span>
						<span className='text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-secondary text-foreground-muted'>
							Soon
						</span>
					</label>
				</div>
			</div>

			{/* Packing Slip Form */}
			<form
				onSubmit={handleSubmit}
				className='flex flex-col gap-8'>
				{/* Company Information */}
				<section className='flex flex-col gap-4'>
					<h2 className='text-sm font-semibold text-foreground border-b border-secondary pb-2'>
						Company Information
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						{/* Company Logo Selector */}
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
										: 'border-gray-400 hover:border-[rgb(91,239,118)] hover:bg-[rgb(91,239,118)]/5'
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

						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:col-span-2'>
							{/* Company Name Selector */}
							{isCustomCompany ? (
								<div className='flex flex-col gap-1.5'>
									<div className='flex justify-between items-center'>
										<label className={labelClass}>
											Company Name
										</label>
										<button
											type='button'
											onClick={() =>
												setIsCustomCompany(false)
											}
											className='text-[11px] text-[rgb(91,239,118)] hover:underline cursor-pointer flex items-center gap-1'>
											<Building2 size={12} />
											Choose Preset
										</button>
									</div>
									<input
										className={inputClass}
										type='text'
										value={companyName}
										onChange={(e) =>
											setCompanyName(e.target.value)
										}
										placeholder='Enter company name'
										required
										autoFocus
									/>
								</div>
							) : (
								<div
									ref={companyDropdownRef}
									className='relative flex flex-col gap-1.5'>
									<div className='flex justify-between items-center'>
										<label className={labelClass}>
											Company Name
										</label>
										<button
											type='button'
											onClick={() =>
												setIsCustomCompany(true)
											}
											className='text-[11px] text-foreground-muted hover:text-[rgb(91,239,118)] hover:underline cursor-pointer flex items-center gap-1 transition-colors'>
											<PenLine size={12} />
											Custom
										</button>
									</div>
									<button
										type='button'
										aria-haspopup='listbox'
										aria-expanded={companyDropdownOpen}
										onClick={() =>
											setCompanyDropdownOpen(
												(prev) => !prev
											)
										}
										className={`${inputClass} flex justify-between items-center cursor-pointer text-left transition-all duration-200 hover:border-foreground-muted/50 ${
											companyDropdownOpen
												? 'ring-1 ring-[rgb(91,239,118)] border-[rgb(91,239,118)]'
												: ''
										}`}>
										<div className='flex items-center gap-2 truncate'>
											<Building2
												size={16}
												className='text-foreground-muted shrink-0'
											/>
											<p className='truncate'>
												{selectedPreset
													? selectedPreset.displayName
													: companyName ||
														'Select a company'}
											</p>
										</div>
										<ChevronDown
											size={16}
											className={`text-foreground-muted transition-transform duration-200 shrink-0 ${
												companyDropdownOpen
													? 'rotate-180 text-foreground'
													: ''
											}`}
										/>
									</button>
									<AnimatePresence>
										{companyDropdownOpen && (
											<motion.div
												initial={{
													opacity: 0,
													y: -4,
													scale: 0.98
												}}
												animate={{
													opacity: 1,
													y: 0,
													scale: 1
												}}
												exit={{
													opacity: 0,
													y: -4,
													scale: 0.98
												}}
												transition={{ duration: 0.15 }}
												className='border border-secondary rounded-xl absolute top-full left-0 mt-1.5 w-full bg-surface shadow-xl z-30 py-1 overflow-hidden backdrop-blur-md'>
												<div className='px-3 py-1.5 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider border-b border-secondary/50'>
													Select a company
												</div>
												{COMPANY_PRESETS.map(
													(preset) => {
														const isSelected =
															companyName ===
															preset.name
														return (
															<button
																key={preset.id}
																type='button'
																onClick={() =>
																	handleSelectCompany(
																		preset
																	)
																}
																className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors duration-150 cursor-pointer text-left ${
																	isSelected
																		? 'bg-[rgb(91,239,118)]/10 text-[rgb(91,239,118)] font-semibold'
																		: 'text-foreground hover:bg-surface-hover/80'
																}`}>
																<div className='flex items-center gap-2.5 truncate'>
																	<Building2
																		size={
																			15
																		}
																		className={
																			isSelected
																				? 'text-[rgb(91,239,118)]'
																				: 'text-foreground-muted'
																		}
																	/>
																	<div className='truncate'>
																		<p className='truncate'>
																			{
																				preset.displayName
																			}
																		</p>
																		<p className='text-xs text-foreground-muted truncate'>
																			{
																				preset.name
																			}
																		</p>
																	</div>
																</div>
																{isSelected && (
																	<Check
																		size={
																			16
																		}
																		className='text-[rgb(91,239,118)] shrink-0'
																	/>
																)}
															</button>
														)
													}
												)}
												<div className='border-t border-secondary/50 pt-1 mt-1'>
													<button
														type='button'
														onClick={() => {
															setIsCustomCompany(
																true
															)
															setCompanyDropdownOpen(
																false
															)
														}}
														className='w-full flex items-center gap-2 px-3.5 py-2 text-xs text-foreground-muted hover:text-foreground hover:bg-surface-hover/80 cursor-pointer transition-colors'>
														<PenLine size={13} />
														Enter custom company
														name...
													</button>
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							)}
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
									onChange={(e) =>
										setCompanyCity(e.target.value)
									}
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
					</div>
				</section>

				{/* Bill To / Ship To */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
					<section className='flex flex-col gap-4'>
						<h2 className='text-sm font-semibold text-foreground border-b border-secondary pb-2'>
							Bill To
						</h2>
						<div className='flex flex-col gap-3'>
							{/* Bill To Preset Dropdown */}
							<div
								ref={billToDropdownRef}
								className='relative flex flex-col gap-1.5'>
								<button
									type='button'
									aria-haspopup='listbox'
									aria-expanded={billToDropdownOpen}
									onClick={() =>
										setBillToDropdownOpen((prev) => !prev)
									}
									className={`${inputClass} flex justify-between items-center cursor-pointer text-left transition-all duration-200 hover:border-foreground-muted/50 ${
										billToDropdownOpen
											? 'ring-1 ring-[rgb(91,239,118)] border-[rgb(91,239,118)]'
											: ''
									}`}>
									<div className='flex items-center gap-2 truncate'>
										<Building2
											size={16}
											className='text-foreground-muted shrink-0'
										/>
										<p
											className={`truncate ${
												selectedBillToPreset
													? 'text-foreground font-medium'
													: 'text-foreground-muted'
											}`}>
											{selectedBillToPreset
												? selectedBillToPreset.displayName
												: billTo
													? 'Custom Address'
													: 'Select destination'}
										</p>
									</div>
									<ChevronDown
										size={16}
										className={`text-foreground-muted transition-transform duration-200 shrink-0 ${
											billToDropdownOpen
												? 'rotate-180 text-foreground'
												: ''
										}`}
									/>
								</button>

								<AnimatePresence>
									{billToDropdownOpen && (
										<motion.div
											initial={{
												opacity: 0,
												y: -4,
												scale: 0.98
											}}
											animate={{
												opacity: 1,
												y: 0,
												scale: 1
											}}
											exit={{
												opacity: 0,
												y: -4,
												scale: 0.98
											}}
											transition={{ duration: 0.15 }}
											className='border border-secondary rounded-xl absolute top-full left-0 mt-1.5 w-full bg-surface shadow-xl z-30 py-1 overflow-hidden backdrop-blur-md max-h-64 overflow-y-auto'>
											<div className='px-3 py-1.5 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider border-b border-secondary/50'>
												Saved Destinations
											</div>
											{ADDRESS_PRESETS.map((preset) => {
												const isSelected =
													billTo.trim() ===
													preset.address.trim()
												return (
													<button
														key={preset.id}
														type='button'
														onClick={() => {
															setBillTo(
																preset.address
															)
															setBillToDropdownOpen(
																false
															)
														}}
														className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors duration-150 cursor-pointer text-left ${
															isSelected
																? 'bg-[rgb(91,239,118)]/10 text-[rgb(91,239,118)] font-semibold'
																: 'text-foreground hover:bg-surface-hover/80'
														}`}>
														<div className='flex items-center gap-2.5 truncate'>
															<Building2
																size={15}
																className={
																	isSelected
																		? 'text-[rgb(91,239,118)]'
																		: 'text-foreground-muted'
																}
															/>
															<div className='truncate'>
																<p className='truncate'>
																	{
																		preset.displayName
																	}
																</p>
																{preset.description && (
																	<p className='text-xs text-foreground-muted truncate'>
																		{
																			preset.description
																		}
																	</p>
																)}
															</div>
														</div>
														{isSelected && (
															<Check
																size={16}
																className='text-[rgb(91,239,118)] shrink-0'
															/>
														)}
													</button>
												)
											})}
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* Bill To Textarea */}
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
						</div>
					</section>

					<section className='flex flex-col gap-4'>
						<div className='flex justify-between items-center border-b border-secondary pb-2'>
							<h2 className='text-sm font-semibold text-foreground'>
								Ship To
							</h2>
							<button
								type='button'
								onClick={() => setShipTo(billTo)}
								className='text-[12px] text-foreground-muted hover:underline cursor-pointer flex items-center gap-1 font-medium'>
								<Copy size={12} />
								Same as Bill To
							</button>
						</div>
						<div className='flex flex-col gap-3'>
							{/* Ship To Preset Dropdown */}
							<div
								ref={shipToDropdownRef}
								className='relative flex flex-col gap-1.5'>
								<button
									type='button'
									aria-haspopup='listbox'
									aria-expanded={shipToDropdownOpen}
									onClick={() =>
										setShipToDropdownOpen((prev) => !prev)
									}
									className={`${inputClass} flex justify-between items-center cursor-pointer text-left transition-all duration-200 hover:border-foreground-muted/50 ${
										shipToDropdownOpen
											? 'ring-1 ring-[rgb(91,239,118)] border-[rgb(91,239,118)]'
											: ''
									}`}>
									<div className='flex items-center gap-2 truncate'>
										<MapPin
											size={16}
											className='text-foreground-muted shrink-0'
										/>
										<p
											className={`truncate ${
												selectedShipToPreset ||
												(shipTo.trim() ===
													billTo.trim() &&
													shipTo.length > 0)
													? 'text-foreground font-medium'
													: 'text-foreground-muted'
											}`}>
											{selectedShipToPreset
												? selectedShipToPreset.displayName
												: shipTo.trim() ===
															billTo.trim() &&
													  shipTo.length > 0
													? 'Same as Bill To'
													: shipTo
														? 'Custom Address'
														: 'Select destination'}
										</p>
									</div>
									<ChevronDown
										size={16}
										className={`text-foreground-muted transition-transform duration-200 shrink-0 ${
											shipToDropdownOpen
												? 'rotate-180 text-foreground'
												: ''
										}`}
									/>
								</button>

								<AnimatePresence>
									{shipToDropdownOpen && (
										<motion.div
											initial={{
												opacity: 0,
												y: -4,
												scale: 0.98
											}}
											animate={{
												opacity: 1,
												y: 0,
												scale: 1
											}}
											exit={{
												opacity: 0,
												y: -4,
												scale: 0.98
											}}
											transition={{ duration: 0.15 }}
											className='border border-secondary rounded-xl absolute top-full left-0 mt-1.5 w-full bg-surface shadow-xl z-30 py-1 overflow-hidden backdrop-blur-md max-h-64 overflow-y-auto'>
											<div className='px-3 py-1.5 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider border-b border-secondary/50'>
												Saved Destinations
											</div>

											{/* Same as Bill To Option */}
											<button
												type='button'
												onClick={() => {
													setShipTo(billTo)
													setShipToDropdownOpen(false)
												}}
												className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors duration-150 cursor-pointer text-left ${
													shipTo.trim() ===
														billTo.trim() &&
													shipTo.length > 0
														? 'bg-[rgb(91,239,118)]/10 text-[rgb(91,239,118)] font-semibold'
														: 'text-foreground hover:bg-surface-hover/80'
												}`}>
												<div className='flex items-center gap-2.5 truncate'>
													<Copy
														size={15}
														className={
															shipTo.trim() ===
																billTo.trim() &&
															shipTo.length > 0
																? 'text-[rgb(91,239,118)]'
																: 'text-foreground-muted'
														}
													/>
													<div className='truncate'>
														<p className='truncate'>
															Same as Bill To
														</p>
														<p className='text-xs text-foreground-muted truncate'>
															Copy billing address
														</p>
													</div>
												</div>
												{shipTo.trim() ===
													billTo.trim() &&
													shipTo.length > 0 && (
														<Check
															size={16}
															className='text-[rgb(91,239,118)] shrink-0'
														/>
													)}
											</button>

											<div className='border-t border-secondary/50 my-1' />

											{ADDRESS_PRESETS.map((preset) => {
												const isSelected =
													shipTo.trim() ===
														preset.address.trim() &&
													!(
														shipTo.trim() ===
															billTo.trim() &&
														preset.address.trim() ===
															billTo.trim()
													)
												return (
													<button
														key={preset.id}
														type='button'
														onClick={() => {
															setShipTo(
																preset.address
															)
															setShipToDropdownOpen(
																false
															)
														}}
														className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors duration-150 cursor-pointer text-left ${
															isSelected
																? 'bg-[rgb(91,239,118)]/10 text-[rgb(91,239,118)] font-semibold'
																: 'text-foreground hover:bg-surface-hover/80'
														}`}>
														<div className='flex items-center gap-2.5 truncate'>
															<MapPin
																size={15}
																className={
																	isSelected
																		? 'text-[rgb(91,239,118)]'
																		: 'text-foreground-muted'
																}
															/>
															<div className='truncate'>
																<p className='truncate'>
																	{
																		preset.displayName
																	}
																</p>
																{preset.description && (
																	<p className='text-xs text-foreground-muted truncate'>
																		{
																			preset.description
																		}
																	</p>
																)}
															</div>
														</div>
														{isSelected && (
															<Check
																size={16}
																className='text-[rgb(91,239,118)] shrink-0'
															/>
														)}
													</button>
												)
											})}
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* Ship To Textarea */}
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
						{/* Incoterm Selector */}
						{isCustomIncoterm ? (
							<div className='flex flex-col gap-1.5'>
								<div className='flex justify-between items-center'>
									<label className={labelClass}>
										Incoterm
									</label>
									<button
										type='button'
										onClick={() =>
											setIsCustomIncoterm(false)
										}
										className='text-[11px] text-[rgb(91,239,118)] hover:underline cursor-pointer flex items-center gap-1'>
										<Globe size={12} />
										Choose Preset
									</button>
								</div>
								<input
									className={inputClass}
									type='text'
									value={incoterm}
									onChange={(e) =>
										setIncoterm(e.target.value)
									}
									placeholder='e.g. CPT, FOB, EXW'
									required
									autoFocus
								/>
							</div>
						) : (
							<div
								ref={incotermDropdownRef}
								className='relative flex flex-col gap-1.5'>
								<div className='flex justify-between items-center'>
									<label className={labelClass}>
										Incoterm
									</label>
									<button
										type='button'
										onClick={() =>
											setIsCustomIncoterm(true)
										}
										className='text-[11px] text-foreground-muted hover:text-[rgb(91,239,118)] hover:underline cursor-pointer flex items-center gap-1 transition-colors'>
										<PenLine size={12} />
										Custom
									</button>
								</div>
								<button
									type='button'
									aria-haspopup='listbox'
									aria-expanded={incotermDropdownOpen}
									onClick={() =>
										setIncotermDropdownOpen((prev) => !prev)
									}
									className={`${inputClass} flex justify-between items-center cursor-pointer text-left transition-all duration-200 hover:border-foreground-muted/50 ${
										incotermDropdownOpen
											? 'ring-1 ring-[rgb(91,239,118)] border-[rgb(91,239,118)]'
											: ''
									}`}>
									<div className='flex items-center gap-2 truncate'>
										<Globe
											size={16}
											className='text-foreground-muted shrink-0'
										/>
										<p
											className={`truncate ${
												incoterm
													? 'text-foreground font-medium'
													: 'text-foreground-muted'
											}`}>
											{selectedIncotermPreset
												? `${selectedIncotermPreset.code} - ${selectedIncotermPreset.name}`
												: incoterm || 'Select Incoterm'}
										</p>
									</div>
									<ChevronDown
										size={16}
										className={`text-foreground-muted transition-transform duration-200 shrink-0 ${
											incotermDropdownOpen
												? 'rotate-180 text-foreground'
												: ''
										}`}
									/>
								</button>

								<AnimatePresence>
									{incotermDropdownOpen && (
										<motion.div
											initial={{
												opacity: 0,
												y: -4,
												scale: 0.98
											}}
											animate={{
												opacity: 1,
												y: 0,
												scale: 1
											}}
											exit={{
												opacity: 0,
												y: -4,
												scale: 0.98
											}}
											transition={{ duration: 0.15 }}
											className='border border-secondary rounded-xl absolute top-full left-0 mt-1.5 w-full bg-surface shadow-xl z-30 py-1 overflow-hidden backdrop-blur-md max-h-64 overflow-y-auto'>
											<div className='px-3 py-1.5 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider border-b border-secondary/50'>
												Incoterms (Trade Terms)
											</div>
											{INCOTERM_PRESETS.map((preset) => {
												const isSelected =
													incoterm === preset.code
												return (
													<button
														key={preset.code}
														type='button'
														onClick={() =>
															handleSelectIncoterm(
																preset.code
															)
														}
														className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors duration-150 cursor-pointer text-left ${
															isSelected
																? 'bg-[rgb(91,239,118)]/10 text-[rgb(91,239,118)] font-semibold'
																: 'text-foreground hover:bg-surface-hover/80'
														}`}>
														<div className='flex items-center gap-2.5 truncate'>
															<Globe
																size={15}
																className={
																	isSelected
																		? 'text-[rgb(91,239,118)]'
																		: 'text-foreground-muted'
																}
															/>
															<div className='truncate'>
																<p className='truncate font-medium'>
																	<span className='font-bold'>
																		{
																			preset.code
																		}
																	</span>
																	<span className='text-foreground-muted font-normal'>
																		{' '}
																		—{' '}
																		{
																			preset.name
																		}
																	</span>
																</p>
																{preset.description && (
																	<p className='text-xs text-foreground-muted truncate'>
																		{
																			preset.description
																		}
																	</p>
																)}
															</div>
														</div>
														{isSelected && (
															<Check
																size={16}
																className='text-[rgb(91,239,118)] shrink-0'
															/>
														)}
													</button>
												)
											})}
											<div className='border-t border-secondary/50 pt-1 mt-1'>
												<button
													type='button'
													onClick={() => {
														setIsCustomIncoterm(
															true
														)
														setIncotermDropdownOpen(
															false
														)
													}}
													className='w-full flex items-center gap-2 px-3.5 py-2 text-xs text-foreground-muted hover:text-foreground hover:bg-surface-hover/80 cursor-pointer transition-colors'>
													<PenLine size={13} />
													Enter custom Incoterm...
												</button>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						)}
						{/* Terms Selector */}
						{isCustomTerms ? (
							<div className='flex flex-col gap-1.5'>
								<div className='flex justify-between items-center'>
									<label className={labelClass}>Terms</label>
									<button
										type='button'
										onClick={() => setIsCustomTerms(false)}
										className='text-[11px] text-[rgb(91,239,118)] hover:underline cursor-pointer flex items-center gap-1'>
										<CreditCard size={12} />
										Choose Preset
									</button>
								</div>
								<input
									className={inputClass}
									type='text'
									value={terms}
									onChange={(e) => setTerms(e.target.value)}
									placeholder='e.g. Net 30, 50% Upfront'
									autoFocus
								/>
							</div>
						) : (
							<div
								ref={termsDropdownRef}
								className='relative flex flex-col gap-1.5'>
								<div className='flex justify-between items-center'>
									<label className={labelClass}>Terms</label>
									<button
										type='button'
										onClick={() => setIsCustomTerms(true)}
										className='text-[11px] text-foreground-muted hover:text-[rgb(91,239,118)] hover:underline cursor-pointer flex items-center gap-1 transition-colors'>
										<PenLine size={12} />
										Custom
									</button>
								</div>
								<button
									type='button'
									aria-haspopup='listbox'
									aria-expanded={termsDropdownOpen}
									onClick={() =>
										setTermsDropdownOpen((prev) => !prev)
									}
									className={`${inputClass} flex justify-between items-center cursor-pointer text-left transition-all duration-200 hover:border-foreground-muted/50 ${
										termsDropdownOpen
											? 'ring-1 ring-[rgb(91,239,118)] border-[rgb(91,239,118)]'
											: ''
									}`}>
									<div className='flex items-center gap-2 truncate'>
										<CreditCard
											size={16}
											className='text-foreground-muted shrink-0'
										/>
										<p
											className={`truncate ${
												terms
													? 'text-foreground font-medium'
													: 'text-foreground-muted'
											}`}>
											{terms ||
												'Select terms (e.g. Net 30)'}
										</p>
									</div>
									<ChevronDown
										size={16}
										className={`text-foreground-muted transition-transform duration-200 shrink-0 ${
											termsDropdownOpen
												? 'rotate-180 text-foreground'
												: ''
										}`}
									/>
								</button>

								<AnimatePresence>
									{termsDropdownOpen && (
										<motion.div
											initial={{
												opacity: 0,
												y: -4,
												scale: 0.98
											}}
											animate={{
												opacity: 1,
												y: 0,
												scale: 1
											}}
											exit={{
												opacity: 0,
												y: -4,
												scale: 0.98
											}}
											transition={{ duration: 0.15 }}
											className='border border-secondary rounded-xl absolute top-full left-0 mt-1.5 w-full bg-surface shadow-xl z-30 py-1 overflow-hidden backdrop-blur-md max-h-64 overflow-y-auto'>
											<div className='px-3 py-1.5 text-[11px] font-semibold text-foreground-muted uppercase tracking-wider border-b border-secondary/50'>
												Payment Terms
											</div>
											{TERMS_PRESETS.map((preset) => {
												const isSelected =
													terms === preset.value
												return (
													<button
														key={preset.label}
														type='button'
														onClick={() =>
															handleSelectTerms(
																preset.value
															)
														}
														className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors duration-150 cursor-pointer text-left ${
															isSelected
																? 'bg-[rgb(91,239,118)]/10 text-[rgb(91,239,118)] font-semibold'
																: 'text-foreground hover:bg-surface-hover/80'
														}`}>
														<div className='flex items-center gap-2.5 truncate'>
															<CreditCard
																size={15}
																className={
																	isSelected
																		? 'text-[rgb(91,239,118)]'
																		: 'text-foreground-muted'
																}
															/>
															<div className='truncate'>
																<p className='truncate'>
																	{
																		preset.label
																	}
																</p>
																{preset.description && (
																	<p className='text-xs text-foreground-muted truncate'>
																		{
																			preset.description
																		}
																	</p>
																)}
															</div>
														</div>
														{isSelected && (
															<Check
																size={16}
																className='text-[rgb(91,239,118)] shrink-0'
															/>
														)}
													</button>
												)
											})}
											<div className='border-t border-secondary/50 pt-1 mt-1'>
												<button
													type='button'
													onClick={() => {
														setIsCustomTerms(true)
														setTermsDropdownOpen(
															false
														)
													}}
													className='w-full flex items-center gap-2 px-3.5 py-2 text-xs text-foreground-muted hover:text-foreground hover:bg-surface-hover/80 cursor-pointer transition-colors'>
													<PenLine size={13} />
													Enter custom terms...
												</button>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						)}
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
										: 'border-gray-400 hover:border-[rgb(91,239,118)] hover:bg-[rgb(91,239,118)]/5'
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
					</div>

					{/* Manufacture Date Format */}
					<div className='flex flex-col gap-2'>
						<label className={labelClass}>
							Manufacture Date Format
						</label>
						<div className='inline-flex p-1 bg-surface border border-secondary rounded-xl shadow-xs gap-1.5 w-fit flex-wrap sm:flex-nowrap'>
							{/* Day / Month / Year */}
							<label
								htmlFor='format_dmy'
								className={`group relative flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
									dateFormat === 'day_month_year'
										? 'bg-primary text-foreground shadow-xs border border-secondary/80'
										: 'text-foreground-muted hover:text-foreground hover:bg-surface-hover/50 border border-transparent'
								}`}>
								<input
									type='radio'
									name='date_format'
									id='format_dmy'
									value='day_month_year'
									checked={dateFormat === 'day_month_year'}
									onChange={() =>
										setDateFormat('day_month_year')
									}
									className='sr-only peer'
								/>
								{/* Custom radio circle indicator */}
								<div
									className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
										dateFormat === 'day_month_year'
											? 'border-[rgb(91,239,118)] bg-[rgb(91,239,118)]/10'
											: 'border-secondary group-hover:border-foreground-muted'
									}`}>
									{dateFormat === 'day_month_year' && (
										<div className='w-2 h-2 rounded-full bg-[rgb(91,239,118)] shadow-[0_0_8px_rgba(91,239,118,0.7)]' />
									)}
								</div>
								<CalendarDays
									size={16}
									className={`transition-colors duration-200 ${
										dateFormat === 'day_month_year'
											? 'text-[rgb(91,239,118)]'
											: 'text-foreground-muted'
									}`}
								/>
								<span>Day / Month / Year</span>
								<span
									className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors ${
										dateFormat === 'day_month_year'
											? 'bg-[rgb(91,239,118)]/15 text-[rgb(91,239,118)] font-semibold'
											: 'bg-secondary text-foreground-muted'
									}`}>
									DD/MM/YYYY
								</span>
							</label>

							{/* Month / Year only */}
							<label
								htmlFor='format_my'
								className={`group relative flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer select-none ${
									dateFormat === 'month_year'
										? 'bg-primary text-foreground shadow-xs border border-secondary/80'
										: 'text-foreground-muted hover:text-foreground hover:bg-surface-hover/50 border border-transparent'
								}`}>
								<input
									type='radio'
									name='date_format'
									id='format_my'
									value='month_year'
									checked={dateFormat === 'month_year'}
									onChange={() => setDateFormat('month_year')}
									className='sr-only peer'
								/>
								{/* Custom radio circle indicator */}
								<div
									className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
										dateFormat === 'month_year'
											? 'border-[rgb(91,239,118)] bg-[rgb(91,239,118)]/10'
											: 'border-secondary group-hover:border-foreground-muted'
									}`}>
									{dateFormat === 'month_year' && (
										<div className='w-2 h-2 rounded-full bg-[rgb(91,239,118)] shadow-[0_0_8px_rgba(91,239,118,0.7)]' />
									)}
								</div>
								<Calendar
									size={16}
									className={`transition-colors duration-200 ${
										dateFormat === 'month_year'
											? 'text-[rgb(91,239,118)]'
											: 'text-foreground-muted'
									}`}
								/>
								<span>Month / Year only</span>
								<span
									className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-colors ${
										dateFormat === 'month_year'
											? 'bg-[rgb(91,239,118)]/15 text-[rgb(91,239,118)] font-semibold'
											: 'bg-secondary text-foreground-muted'
									}`}>
									MM/YYYY
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
				</section>

				{error && excelFile && (
					<p className='text-sm text-red-500'>{error}</p>
				)}

				{/* Actions */}
				<div className='flex gap-3 pt-4 border-t border-secondary'>
					<button
						type='button'
						onClick={handleReset}
						className='flex-1 px-4 py-3 rounded-lg text-sm font-semibold text-foreground-muted bg-surface border border-secondary hover:bg-white transition-all duration-200 cursor-pointer'>
						Reset Form
					</button>
					<button
						type='submit'
						disabled={loading}
						className='flex-1 px-4 py-3 rounded-lg text-sm font-semibold text-black bg-[rgb(91,239,118)] hover:bg-green-400 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition-all duration-200'>
						{loading ? 'Generating...' : 'Generate Packing Slip'}
					</button>
				</div>
			</form>
		</main>
	)
}

export default DocumentGenerator
