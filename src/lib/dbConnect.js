import { MongoClient } from 'mongodb';

// Connection URI - Replace with your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || 'thalaApp';

// Check the MongoDB URI
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // If we have a cached connection, use it
  if (cachedClient && cachedDb) {
    return cachedDb;
  }

  // If no cached connection, create a new one
  const client = await MongoClient.connect(MONGODB_URI, {
    maxPoolSize: 10,
  });

  const db = client.db(MONGODB_DB);

  // Cache the connection
  cachedClient = client;
  cachedDb = db;

  return db;
}