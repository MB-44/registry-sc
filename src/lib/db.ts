import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "your_mongodb_connection_string";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: "weddingRegistry",
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully!");
      return mongoose;
    }).catch((error) => {
      console.error("❌ MongoDb connecting to MongoDB:", error);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDB;