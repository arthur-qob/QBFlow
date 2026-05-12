'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Themes = 'light' | 'dark' | 'system'

type ThemeContextType = {
	theme: Themes
	setTheme: (theme: Themes) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeContextProvider = ({
	children
}: {
	children: React.ReactNode
}) => {
	const [theme, setTheme] = useState<Themes>('light')

	useEffect(() => {
		let resolved: 'light' | 'dark' = 'light'
		if (theme === 'system') {
			resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light'
		} else {
			resolved = theme
		}
		document.documentElement.setAttribute('data-theme', resolved)
	}, [theme])

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (!context)
		throw new Error('useTheme must be used within ThemeContextProvider!')

	return context
}
