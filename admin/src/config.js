export const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'https://online-cloth-store-1.onrender.com').replace(/\/$/, '')
export const currency = '₹'

export const authConfig = (token) => ({
	headers: {
		token,
		Authorization: `Bearer ${token}`
	}
})
