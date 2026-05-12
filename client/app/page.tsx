import NavBar from './components/landing_ui/navBar'
import FeaturesSection from './components/landing_ui/featuresSection'
import HeroSection from './components/landing_ui/heroSection'
import AboutSection from './components/landing_ui/aboutSection'
import PricingSection from './components/landing_ui/pricingSection'
import ContactSection from './components/landing_ui/contactSection'

export default function Home() {
	return (
		<main className='relative bg-black'>
			<NavBar />
			<HeroSection />
			<FeaturesSection />
			<AboutSection />
			<PricingSection />
			<ContactSection />
		</main>
	)
}
