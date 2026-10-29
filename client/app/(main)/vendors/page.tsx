'use client'

import { useEffect, useState, useCallback } from 'react'
import EntityManager from '@/app/components/entityManager'
import { VendorsApi } from '@/util/api'
import type { Vendor } from '@/util/types'

export default function VendorsPage() {
	const [vendors, setVendors] = useState<Vendor[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const loadVendors = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			const list = await VendorsApi.list()
			setVendors(list)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Failed to fetch vendors.')
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		loadVendors()
	}, [loadVendors])

	const handleSave = async (data: Partial<Vendor>) => {
		if (data.id) {
			await VendorsApi.update(data.id, data)
		} else {
			await VendorsApi.create(data as Omit<Vendor, 'id' | 'created_at' | 'updated_at'>)
		}
		await loadVendors()
	}

	const handleDelete = async (id: string) => {
		await VendorsApi.delete(id)
		await loadVendors()
	}

	return (
		<EntityManager
			entityName='Vendor'
			entityPlural='Vendors'
			entities={vendors}
			loading={loading}
			error={error}
			onSave={handleSave}
			onDelete={handleDelete}
		/>
	)
}
