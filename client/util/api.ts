import { getIdToken } from './firebase/auth'
import type { Client, Vendor, Buyer, AppUser, Document } from './types'

// In Next.js rewrites: /api/* routes through NEXT_PUBLIC_API_URL or local server
const BASE = process.env.NEXT_PUBLIC_API_URL || ''

async function authHeaders(): Promise<HeadersInit> {
	const token = await getIdToken()
	return token ? { Authorization: `Bearer ${token}` } : {}
}

async function apiFetch(
	path: string,
	init: RequestInit = {}
): Promise<Response> {
	const headers = await authHeaders()
	return fetch(path, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...headers,
			...init.headers
		}
	})
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export async function verifyToken(idToken: string): Promise<AppUser> {
	const res = await fetch(`${BASE}/api/auth/verify`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ id_token: idToken })
	})
	if (!res.ok) throw new Error(await res.text())
	return res.json()
}

// ---------------------------------------------------------------------------
// Generic entity factory
// ---------------------------------------------------------------------------
function makeEntityApi<T extends { id: string }>(resource: string) {
	return {
		list: async (): Promise<T[]> => {
			const res = await apiFetch(`${BASE}/api/${resource}`)
			if (!res.ok) throw new Error(await res.text())
			return res.json()
		},
		get: async (id: string): Promise<T> => {
			const res = await apiFetch(`${BASE}/api/${resource}/${id}`)
			if (!res.ok) throw new Error(await res.text())
			return res.json()
		},
		create: async (
			data: Omit<T, 'id' | 'created_at' | 'updated_at'>
		): Promise<T> => {
			const res = await apiFetch(`${BASE}/api/${resource}`, {
				method: 'POST',
				body: JSON.stringify(data)
			})
			if (!res.ok) throw new Error(await res.text())
			return res.json()
		},
		update: async (id: string, data: Partial<T>): Promise<T> => {
			const res = await apiFetch(`${BASE}/api/${resource}/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data)
			})
			if (!res.ok) throw new Error(await res.text())
			return res.json()
		},
		delete: async (id: string): Promise<void> => {
			const res = await apiFetch(`${BASE}/api/${resource}/${id}`, {
				method: 'DELETE'
			})
			if (!res.ok) throw new Error(await res.text())
		}
	}
}

export const ClientsApi = makeEntityApi<Client>('clients')
export const VendorsApi = makeEntityApi<Vendor>('vendors')
export const BuyersApi = makeEntityApi<Buyer>('buyers')

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export const UsersApi = {
	list: async (): Promise<AppUser[]> => {
		const res = await apiFetch(`${BASE}/api/users`)
		if (!res.ok) throw new Error(await res.text())
		return res.json()
	},
	get: async (id: string): Promise<AppUser> => {
		const res = await apiFetch(`${BASE}/api/users/${id}`)
		if (!res.ok) throw new Error(await res.text())
		return res.json()
	},
	update: async (id: string, data: Partial<AppUser>): Promise<AppUser> => {
		const res = await apiFetch(`${BASE}/api/users/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data)
		})
		if (!res.ok) throw new Error(await res.text())
		return res.json()
	},
	delete: async (id: string): Promise<void> => {
		const res = await apiFetch(`${BASE}/api/users/${id}`, {
			method: 'DELETE'
		})
		if (!res.ok) throw new Error(await res.text())
	}
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------
export const DocumentsApi = {
	list: async (clientId?: string): Promise<Document[]> => {
		const q = clientId ? `?client_id=${clientId}` : ''
		const res = await apiFetch(`${BASE}/api/documents${q}`)
		if (!res.ok) throw new Error(await res.text())
		return res.json()
	},
	create: async (
		data: Omit<Document, 'id' | 'created_at'>
	): Promise<Document> => {
		const res = await apiFetch(`${BASE}/api/documents`, {
			method: 'POST',
			body: JSON.stringify(data)
		})
		if (!res.ok) throw new Error(await res.text())
		return res.json()
	},
	delete: async (id: string): Promise<void> => {
		const res = await apiFetch(`${BASE}/api/documents/${id}`, {
			method: 'DELETE'
		})
		if (!res.ok) throw new Error(await res.text())
	}
}

// ---------------------------------------------------------------------------
// PDF generation (multipart/form-data)
// ---------------------------------------------------------------------------
export async function generatePackingSlip(
	formData: FormData
): Promise<Response> {
	const res = await fetch(`${BASE}/generate`, { method: 'POST', body: formData })
	if (!res.ok) throw new Error(await res.text())
	return res
}

export async function generateInvoice(formData: FormData): Promise<Response> {
	const res = await fetch(`${BASE}/generate-invoice`, {
		method: 'POST',
		body: formData
	})
	if (!res.ok) throw new Error(await res.text())
	return res
}

// ---------------------------------------------------------------------------
// PDF → Excel converter (SSE stream)
// ---------------------------------------------------------------------------
export async function startPdfExtraction(formData: FormData): Promise<{ job_id: string }> {
	const res = await fetch(`${BASE}/extract-pdf/start`, {
		method: 'POST',
		body: formData
	})
	if (!res.ok) {
		const err = await res.json().catch(() => ({ error: 'Extraction start failed' }))
		throw new Error(err.error || 'Failed to start PDF extraction')
	}
	return res.json()
}

export function getPdfStreamUrl(jobId: string): string {
	return `${BASE}/extract-pdf/stream/${jobId}`
}

export function getPdfResultUrl(jobId: string): string {
	return `${BASE}/extract-pdf/result/${jobId}`
}

export const Api = {
	generatePackingSlip,
	generateInvoice,
	startPdfExtraction,
	getPdfStreamUrl,
	getPdfResultUrl
}
