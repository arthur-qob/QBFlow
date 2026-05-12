export class Api {
	static generatePackingSlip = async (formData: FormData) => {
		try {
			const res = await fetch('/generate', {
				method: 'POST',
				body: formData
			})

			if (!res.ok) {
				const error = await res.text()
				throw new Error(error)
			}
		} catch (e: any) {
			return e.message
		}
	}
}
