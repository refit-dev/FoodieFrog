import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

let client;
let clientPromise;

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so the connection is preserved across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export const collectionNamesObj = {
  userCollection: "users",
  restaurantCollection: "restaurants",
  favoriteRestaurantsCollection: "favoriteRestaurants",
  menuCollection: "menus",
  orderCollection: "orders",
  reviewsCollection: 'reviews',
  categoryCollection: "categories"
};

export async function dbConnect(collectionName) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    return db.collection(collectionName);
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to database");
  }
}