"use server"

import { authOptions } from "@/lib/authOptions";
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";

export default async function RegisterRestaurant(payload) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const email = session.user.email;
  const { 
    restaurantName, 
    password, 
    description, 
    cuisineType, 
    address, 
    phone, 
    deliveryTime, 
    image 
  } = payload;

  if (!restaurantName || !password || !cuisineType || !address || !phone) {
    return { success: false, message: "All required fields must be filled" };
  }

  const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);

  // Check if restaurant already exists
  const existingRestaurant = await restaurantCollection.findOne({ email });
  if (existingRestaurant) {
    return { success: false, message: "Email already registered as restaurant" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await restaurantCollection.insertOne({
    restaurantName,
    email,
    password: hashedPassword,
    description: description || "",
    cuisineType,
    address,
    phone,
    deliveryTime: deliveryTime || "30-45 min",
    image: image || "",
    role: "restaurant",
    isActive: true,
    rating: 0,
    createdAt: new Date(),
  });

  return {
    success: true,
    insertedId: result.insertedId.toString(),
    message: "Restaurant registered successfully!",
  };
}