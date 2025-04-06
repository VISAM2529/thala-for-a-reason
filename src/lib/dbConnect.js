import mongoose from "mongoose";

let isConnected = false;

export default async function dbConnect() {
  if (isConnected) return;

  if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || "thalaApp",
    });

    isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}
