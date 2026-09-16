export const backendUrl = (import.meta.env.VITE_BACKEND_URL || 'https://online-cloth-store-1.onrender.com').replace(/\/$/, '')
export const currency = '₹'

export const authConfig = (token) => ({
	headers: {
		token,
		Authorization: `Bearer ${token}`
	}
})

export const resolveProductImage = (image) => {
	if (!image || typeof image !== 'string') return ''
	if (/^https?:\/\//i.test(image)) return image

	const path = image.startsWith('/') ? image : `/${image}`
	return `https://online-cloth-store-eight.vercel.app${path}`
}
