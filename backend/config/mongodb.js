import mongoose from "mongoose";

let connectionPromise;

const connectDB = async () => {

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

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

    connectionPromise = mongoose.connect(dbUri)
    try {
        await connectionPromise
        return mongoose.connection
    } catch (error) {
        connectionPromise = undefined
        throw error
    }

}

export default connectDB;