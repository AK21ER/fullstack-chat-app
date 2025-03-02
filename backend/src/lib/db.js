import mongoose from "mongoose";

export const connection_db = async () => {
    try {
        const conn = await mongoose.connect(process.env.mongoo);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};
