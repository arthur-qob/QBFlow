import Link from 'next/link'
import { FileUp, ArrowRight } from 'lucide-react'

export default function DocumentUploadPage() {
	return (
		<main className='pl-24 pr-10 py-8 min-h-screen w-full bg-secondary text-foreground'>
			<div className='max-w-3xl mx-auto py-12 text-center'>
				<div className='w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4'>
					<FileUp size={32} />
				</div>
				<h1 className='text-3xl font-bold tracking-tight'>Document Upload & Sync</h1>
				<p className='text-foreground-muted mt-2 max-w-lg mx-auto'>
					Direct QuickBooks invoice and document synchronisation is being integrated with your connected QuickBooks company account.
				</p>

				<div className='mt-8 p-6 bg-primary border border-secondary rounded-xl text-left'>
					<h3 className='font-semibold text-sm mb-2 text-foreground'>Currently Available Tools</h3>
					<ul className='space-y-3 text-sm text-foreground-muted'>
						<li className='flex items-center gap-2'>
							<ArrowRight size={16} className='text-emerald-400' />
							<span>
								<Link href='/document-generator' className='text-emerald-400 hover:underline font-medium'>
									Document Generator
								</Link>{' '}
								— Create custom Packing Slips and Invoices from Excel templates.
							</span>
						</li>
						<li className='flex items-center gap-2'>
							<ArrowRight size={16} className='text-emerald-400' />
							<span>
								<Link href='/document-scanner' className='text-emerald-400 hover:underline font-medium'>
									PDF to Excel Converter
								</Link>{' '}
								— Convert supplier invoice PDFs into Excel sheets automatically.
							</span>
						</li>
					</ul>
				</div>
			</div>
		</main>
	)
}

