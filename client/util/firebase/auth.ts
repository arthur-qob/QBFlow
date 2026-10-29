import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut as fbSignOut,
	onAuthStateChanged as fbOnAuthStateChanged,
	User
} from 'firebase/auth'
import app from './firebaseConfig'

export const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle(): Promise<User> {
	const result = await signInWithPopup(auth, googleProvider)
	return result.user
}

export async function signOut(): Promise<void> {
	await fbSignOut(auth)
}

export function onAuthStateChanged(cb: (user: User | null) => void) {
	return fbOnAuthStateChanged(auth, cb)
}

export async function getIdToken(): Promise<string | null> {
	const user = auth.currentUser
	if (!user) return null
	return user.getIdToken()
}
