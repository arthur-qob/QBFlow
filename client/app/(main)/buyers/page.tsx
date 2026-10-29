'use client'

import { useEffect, useState, useCallback } from 'react'
import EntityManager from '@/app/components/entityManager'
import { BuyersApi } from '@/util/api'
import type { Buyer } from '@/util/types'

export default function BuyersPage() {
	const [buyers, setBuyers] = useState<Buyer[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const loadBuyers = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			const list = await BuyersApi.list()
			setBuyers(list)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Failed to fetch buyers.')
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		loadBuyers()
	}, [loadBuyers])

	const handleSave = async (data: Partial<Buyer>) => {
		if (data.id) {
			await BuyersApi.update(data.id, data)
		} else {
			await BuyersApi.create(data as Omit<Buyer, 'id' | 'created_at' | 'updated_at'>)
		}
		await loadBuyers()
	}

	const handleDelete = async (id: string) => {
		await BuyersApi.delete(id)
		await loadBuyers()
	}

	return (
		<EntityManager
			entityName='Buyer'
			entityPlural='Buyers'
			entities={buyers}
			loading={loading}
			error={error}
			onSave={handleSave}
			onDelete={handleDelete}
		/>
	)
}
