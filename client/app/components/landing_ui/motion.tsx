'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const VP = { once: true, amount: 0.15 }
const EASE = 'easeOut'

// ── Shared variants ──────────────────────────────────────────────────────────

export const fadeUpVariant: Variants = {
	hidden: { opacity: 0, y: 28 },
	visible: { opacity: 1, y: 0 },
}

export const fadeInVariant: Variants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1 },
}

export const slideLeftVariant: Variants = {
	hidden: { opacity: 0, x: -36 },
	visible: { opacity: 1, x: 0 },
}

export const slideRightVariant: Variants = {
	hidden: { opacity: 0, x: 36 },
	visible: { opacity: 1, x: 0 },
}

export const staggerVariant: Variants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.12 } },
}

// ── Wrapper components ────────────────────────────────────────────────────────

type Props = { children: ReactNode; delay?: number; className?: string }
type StaggerProps = { children: ReactNode; className?: string; delay?: number }

export function FadeUp({ children, delay = 0, className }: Props) {
	return (
		<motion.div
			variants={fadeUpVariant}
			initial='hidden'
			whileInView='visible'
			viewport={VP}
			transition={{ duration: 0.5, ease: EASE, delay }}
			className={className}>
			{children}
		</motion.div>
	)
}

export function FadeIn({ children, delay = 0, className }: Props) {
	return (
		<motion.div
			variants={fadeInVariant}
			initial='hidden'
			whileInView='visible'
			viewport={VP}
			transition={{ duration: 0.5, ease: EASE, delay }}
			className={className}>
			{children}
		</motion.div>
	)
}

export function SlideLeft({ children, delay = 0, className }: Props) {
	return (
		<motion.div
			variants={slideLeftVariant}
			initial='hidden'
			whileInView='visible'
			viewport={VP}
			transition={{ duration: 0.55, ease: EASE, delay }}
			className={className}>
			{children}
		</motion.div>
	)
}

export function SlideRight({ children, delay = 0, className }: Props) {
	return (
		<motion.div
			variants={slideRightVariant}
			initial='hidden'
			whileInView='visible'
			viewport={VP}
			transition={{ duration: 0.55, ease: EASE, delay }}
			className={className}>
			{children}
		</motion.div>
	)
}

/** Staggered container — children using StaggerItem will animate in sequence */
export function Stagger({ children, className, delay = 0 }: StaggerProps) {
	return (
		<motion.div
			variants={staggerVariant}
			initial='hidden'
			whileInView='visible'
			viewport={VP}
			transition={{ delay }}
			className={className}>
			{children}
		</motion.div>
	)
}

/** Must be a direct child of <Stagger> to receive stagger timing */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
	return (
		<motion.div
			variants={fadeUpVariant}
			transition={{ duration: 0.5, ease: EASE }}
			className={className}>
			{children}
		</motion.div>
	)
}
