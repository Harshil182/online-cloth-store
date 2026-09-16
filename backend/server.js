import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB().catch((error) => {
    console.error('Database connection failed:', error.message)
})
connectCloudinary()

// middlewares
app.use(express.json())

const allowedOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean)

const isAllowedOrigin = (origin) => {
    if (!origin) {
        return true
    }

    if (allowedOrigins.includes(origin)) {
        return true
    }

    return /^https:\/\/online-cloth-store(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(origin)
}

app.use(cors({
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            return callback(null, true)
        }

        return callback(null, false)
    },
    credentials: true
}))

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.get('/health',(req,res)=>{
    res.json({ success: true, status: 'ok' })
})

if (!process.env.VERCEL) {
    app.listen(port, ()=> console.log('Server started on PORT : '+ port))
}

export default app