'use client'

import { useEffect, useState, useCallback } from 'react'
import EntityManager from '@/app/components/entityManager'
import { ClientsApi } from '@/util/api'
import type { Client } from '@/util/types'

export default function ClientsPage() {
	const [clients, setClients] = useState<Client[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const loadClients = useCallback(async () => {
		try {
			setLoading(true)
			setError(null)
			const list = await ClientsApi.list()
			setClients(list)
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Failed to fetch clients.')
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		loadClients()
	}, [loadClients])

	const handleSave = async (data: Partial<Client>) => {
		if (data.id) {
			await ClientsApi.update(data.id, data)
		} else {
			await ClientsApi.create(data as Omit<Client, 'id' | 'created_at' | 'updated_at'>)
		}
		await loadClients()
	}

	const handleDelete = async (id: string) => {
		await ClientsApi.delete(id)
		await loadClients()
	}

	return (
		<EntityManager
			entityName='Client'
			entityPlural='Clients'
			entities={clients}
			loading={loading}
			error={error}
			onSave={handleSave}
			onDelete={handleDelete}
		/>
	)
}
