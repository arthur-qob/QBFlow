'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User } from 'firebase/auth'
import { onAuthStateChanged } from '@/util/firebase/auth'
import { verifyToken } from '@/util/api'
import type { AppUser } from '@/util/types'

interface UserContextType {
	firebaseUser: User | null
	appUser: AppUser | null
	loading: boolean
	setAppUser: (u: AppUser | null) => void
}

const UserContext = createContext<UserContextType | null>(null)

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
	const [appUser, setAppUser] = useState<AppUser | null>(null)
	const [loading, setLoading] = useState(true)

	const syncUser = useCallback(async (user: User | null) => {
		setFirebaseUser(user)
		if (!user) {
			setAppUser(null)
			setLoading(false)
			return
		}
		try {
			const token = await user.getIdToken()
			const profile = await verifyToken(token)
			setAppUser(profile)
		} catch {
			// Server may be offline – still allow the app to work with Firebase user
			setAppUser({
				id: user.uid,
				first_name: user.displayName?.split(' ')[0] ?? '',
				last_name: user.displayName?.split(' ').slice(1).join(' ') ?? '',
				email: user.email ?? '',
				avatar_url: user.photoURL ?? '',
				created_at: new Date().toISOString()
			})
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		const unsub = onAuthStateChanged(syncUser)
		return unsub
	}, [syncUser])

	return (
		<UserContext.Provider value={{ firebaseUser, appUser, loading, setAppUser }}>
			{children}
		</UserContext.Provider>
	)
}

export const useUser = () => {
	const ctx = useContext(UserContext)
	if (!ctx) throw new Error('useUser must be used within UserContextProvider')
	return ctx
}
