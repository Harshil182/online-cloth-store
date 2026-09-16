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

const localOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
]

const isAllowedOrigin = (origin) => {
    if (!origin) {
        return true
    }

    if ([...allowedOrigins, ...localOrigins].includes(origin)) {
        return true
    }

    return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)
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

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.get('/health',(req,res)=>{
    res.json({ success: true, status: 'ok' })
})

app.use(async (req, res, next) => {
    try {
        await connectDB()
        next()
    } catch (error) {
        console.error('Database request error:', error.message)
        res.status(503).json({ success: false, message: 'Database is unavailable' })
    }
})

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

if (!process.env.VERCEL) {
    app.listen(port, ()=> console.log('Server started on PORT : '+ port))
}

export default app