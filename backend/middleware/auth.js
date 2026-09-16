import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

    const authorization = req.headers.authorization
    const token = req.headers.token || (authorization && authorization.startsWith('Bearer ')
        ? authorization.split(' ')[1]
        : '')

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized Login Again' })
    }

    try {

        const token_decode = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey123')
        req.userId = token_decode.id
        next()

    } catch (error) {
        console.log(error)
        res.status(401).json({ success: false, message: 'Session expired or invalid token' })
    }

}

export default authUser