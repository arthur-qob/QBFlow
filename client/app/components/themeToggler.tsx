'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/app/contexts/themeContext'

const THEMES = ['light', 'dark', 'system'] as const

const THEME_META = {
	light: { icon: Sun, label: 'Light' },
	dark: { icon: Moon, label: 'Dark' },
	system: { icon: Monitor, label: 'System' },
}

const ThemeToggler = ({ isOpen }: { isOpen: boolean }) => {
	const { theme, setTheme } = useTheme()

	const cycle = () => {
		const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]
		setTheme(next)
	}

	const { icon: Icon, label } = THEME_META[theme]

	return (
		<button
			type='button'
			onClick={cycle}
			title={!isOpen ? `Theme: ${label}` : undefined}
			className={`flex items-center gap-2 hover:bg-surface-hover transition-colors duration-200 rounded-md px-2 py-1 cursor-pointer ${
				isOpen ? 'w-full' : 'w-fit'
			}`}>
			<Icon size={24} aria-hidden='true' />
			{isOpen && (
				<span className='whitespace-nowrap text-lg'>{label}</span>
			)}
		</button>
	)
}

export default ThemeToggler
