import mongoose from "mongoose";

const MONGO_URI = import.meta.env.VITE_MONGO_URI;

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("Already connected to MongoDB");
        return;
    }

    if (!MONGO_URI) {
        console.error("MONGO_URI is not defined in environment variables");
        throw new Error("MONGO_URI is not defined");
    }

    try {
        const db = await mongoose.connect(MONGO_URI, {
            dbName: "pullstore_db",
        });
        
        isConnected = db.connections[0].readyState === 1;
        console.log("Connected to MongoDB");
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

export default connectDB;    