"use server"

import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";
import bcrypt from "bcrypt";

export default async function RegisterUser(payload) {
  const { name, email, password, phone } = payload;

  // Validate required fields
  if (!name || !email || !password || !phone) {
    return { success: false, message: "All fields are required" };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: "Please enter a valid email address" };
  }

  // Validate password length
  if (password.length < 6) {
    return { success: false, message: "Password must be at least 6 characters long" };
  }

  try {
    const userCollection = await dbConnect(collectionNamesObj.userCollection);

    // Check if user already exists
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return { success: false, message: "Email already registered" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user
    const result = await userCollection.insertOne({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone.trim(),
      role: "customer",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (result.insertedId) {
      return {
        success: true,
        insertedId: result.insertedId.toString(),
        message: "Account created successfully! You can now login.",
      };
    } else {
      return { success: false, message: "Failed to create account. Please try again." };
    }

  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return { success: false, message: "Email already exists" };
    }
    
    return { 
      success: false, 
      message: "Server error during registration. Please try again later." 
    };
  }
}