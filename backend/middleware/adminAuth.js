import jwt from 'jsonwebtoken'

const adminAuth = async (req,res,next) => {
    try {
        const authorization = req.headers.authorization
        const token = req.headers.token || (authorization && authorization.startsWith('Bearer ')
            ? authorization.split(' ')[1]
            : '')
        if (!token) {
            return res.status(401).json({success:false,message:"Not Authorized Login Again"})
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey123');
        if (!token_decode.isAdmin) {
            return res.status(401).json({success:false,message:"Not Authorized Login Again"})
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ success: false, message: "Session expired or invalid token" })
    }
}

export default adminAuth