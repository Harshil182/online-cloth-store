import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected',() => {
        console.log("DB Connected");
    })

    const uri = process.env.MONGODB_URI
    if (!uri) {
        throw new Error('MONGODB_URI is not configured')
    }

    const parsedUri = new URL(uri)
    if (!parsedUri.pathname || parsedUri.pathname === '/') {
        parsedUri.pathname = '/e-commerce'
    }

    const dbUri = parsedUri.toString()

    await mongoose.connect(dbUri)

}

export default connectDB;