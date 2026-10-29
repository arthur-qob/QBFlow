// Shared TypeScript types for QBFlow

export interface Client {
	id: string
	name: string
	address: string
	city: string
	phone: string
	email: string
	website: string
	logo_b64: string      // base64-encoded logo image
	color_theme: string   // hex accent color e.g. "#4a5080"
	created_at: string
	updated_at: string
}

// Vendor and Buyer share the same shape as Client
export type Vendor = Client
export type Buyer = Client

export interface AppUser {
	id: string            // Firebase UID
	first_name: string
	last_name: string
	email: string
	avatar_url: string
	created_at: string
}

export interface Document {
	id: string
	client_id: string
	buyer_id: string
	type: 'packing_slip' | 'invoice'
	invoice_number: string
	invoice_date: string
	status: string
	created_at: string
	data: Record<string, unknown>
}

// Blank entity helpers
export const blankClient = (): Omit<Client, 'id' | 'created_at' | 'updated_at'> => ({
	name: '',
	address: '',
	city: '',
	phone: '',
	email: '',
	website: '',
	logo_b64: '',
	color_theme: '#4a5080'
})
