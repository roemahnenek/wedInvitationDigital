import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please provide MONGODB_URI in the environment variables");
}

let cached = global.mongoose || { const: null, promise: null}
global.mongoose = cached;

export default async function dbConnect() {
    if(cached.conn) return cached.conn;

    
    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: "undangan-db",
        }).then((mongoose) => mongoose)
    }

    cached.conn = await cached.promise;
    return cached.conn;
}