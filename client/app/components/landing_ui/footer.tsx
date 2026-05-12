const Footer = () => {
	return (
		<>
			<div
				className='w-full h-px'
				style={{
					background:
						'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)'
				}}
			/>
			<p className='text-white/20 text-xs text-center'>
				© {new Date().getFullYear()} QBFlow. All rights reserved.
			</p>
		</>
	)
}

export default Footer
