import { ThemeContextProvider } from '@/app/contexts/themeContext'
import SideBar from '../components/sideBar'

export default function MainLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<ThemeContextProvider>
			<div className='relative'>
				<SideBar />
				{children}
			</div>
		</ThemeContextProvider>
	)
}
