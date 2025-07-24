// Make sure to install mongoose: npm install mongoose @types/mongoose
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

type MongooseCache = {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
};

declare global {
    var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

export async function dbConnect(): Promise<Mongoose> {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        }).then((mongooseInstance: Mongoose) => mongooseInstance);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

global.mongoose = cached; 