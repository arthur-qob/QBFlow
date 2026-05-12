'use client'

interface MenuButtonProps {
	isOpen?: boolean
	onClick?: () => void
	className?: string
}

const MenuButton = ({
	isOpen = false,
	onClick,
	className
}: MenuButtonProps) => {
	const currentState = isOpen

	return (
		<button
			type='button'
			className={`cursor-pointer w-8 h-8 bg-transparent border-none outline-none ${
				className || ''
			}`}
			onClick={onClick}
			aria-label={currentState ? 'Close menu' : 'Open menu'}>
			<svg
				className='w-full h-full transition-all duration-300 ease-in-out'
				viewBox='0 0 100 100'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'>
				{/* Top bar - becomes top part of X */}
				<rect
					className={`fill-foreground transition-all duration-300 ease-in-out ${
						currentState
							? 'translate-y-[26px] rotate-45 !fill-red-500'
							: ''
					}`}
					style={{ transformOrigin: '50px 24px' }}
					x='10'
					y='20'
					width='80'
					height='8'
					rx='4'
				/>
				{/* Middle bar - fades out */}
				<rect
					className={`fill-foreground transition-all duration-300 ease-in-out ${
						currentState ? 'opacity-0 scale-x-0' : ''
					}`}
					x='10'
					y='46'
					width='80'
					height='8'
					rx='4'
				/>
				{/* Bottom bar - becomes bottom part of X */}
				<rect
					className={`fill-foreground transition-all duration-300 ease-in-out ${
						currentState
							? '-translate-y-[26px] -rotate-45 !fill-red-500'
							: ''
					}`}
					style={{ transformOrigin: '50px 76px' }}
					x='10'
					y='72'
					width='80'
					height='8'
					rx='4'
				/>
			</svg>
		</button>
	)
}

export default MenuButton
