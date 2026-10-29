import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const NewBuyer = () => {
	return (
		<main className='pl-25 pr-10 py-8 h-full w-full bg-secondary'>
			<Link
				href='/buyers'
				className='bg-secondary hover:bg-surface-hover transition-colors duration-200 rounded-lg cursor-pointer mb-8 flex w-fit'>
				<ChevronLeft size={24} />
			</Link>

			<h1 className='text-2xl font-semibold tracking-wider'>New Buyer</h1>
		</main>
	)
}

export default NewBuyer
