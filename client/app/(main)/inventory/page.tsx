export default function InventoryPage() {
	return (
		<main className='pl-24 pr-10 py-8 min-h-screen w-full bg-secondary text-foreground'>
			<div className='max-w-4xl mx-auto'>
				<h1 className='text-2xl font-bold tracking-tight'>Inventory</h1>
				<p className='text-foreground-muted mt-1 text-sm'>
					Item lots, batches, expiration dates and stock levels.
				</p>
				<div className='mt-8 p-12 bg-primary border border-secondary rounded-xl text-center text-foreground-muted'>
					<p className='text-sm'>Real-time stock level synchronization from generated invoices and receipts.</p>
				</div>
			</div>
		</main>
	)
}

