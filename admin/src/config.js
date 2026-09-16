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

	const productAsset = image.match(/(p_img\d+(?:[_-]\d+)?)(?:-[a-z0-9]+)?\.png/i)
	if (productAsset) return `/product-images/${productAsset[1]}.png`
	if (/^https?:\/\//i.test(image)) return image

	return image.startsWith('/') ? image : `/${image}`
}
