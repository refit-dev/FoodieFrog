import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await req.json();
    const { 
      restaurantName, 
      password, 
      description, 
      cuisineType, 
      address, 
      phone, 
      deliveryTime, 
      deliveryFee,
      minimumOrder,
      image 
    } = payload;

    // Validate required fields
    if (!restaurantName || !password) {
      return NextResponse.json(
        { success: false, message: 'Restaurant name and password are required' },
        { status: 400 }
      );
    }

    const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);
    const userCollection = await dbConnect(collectionNamesObj.userCollection);

    // Check if user already has a restaurant
    const existingRestaurant = await restaurantCollection.findOne({ 
      ownerEmail: session.user.email 
    });
    
    if (existingRestaurant) {
      return NextResponse.json(
        { success: false, message: 'You already have a registered restaurant' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert restaurant with all provided data
    const result = await restaurantCollection.insertOne({
      name: restaurantName,
      email: session.user.email,
      password: hashedPassword,
      description: description || '',
      cuisineType: cuisineType || 'Other',
      address: address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      phone: phone || '',
      deliveryTime: deliveryTime || '30-45 min',
      deliveryFee: deliveryFee || 2.99,
      minimumOrder: minimumOrder || 0,
      image: image || '',
      ownerId: session.user.id,
      ownerEmail: session.user.email,
      role: 'restaurant',
      isActive: true,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Update user role to restaurant
    await userCollection.updateOne(
      { email: session.user.email },
      { $set: { role: 'restaurant' } }
    );

    return NextResponse.json({
      success: true,
      message: 'Restaurant registered successfully!',
      data: { id: result.insertedId }
    });

  } catch (error) {
    console.error('Restaurant registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during registration' },
      { status: 500 }
    );
  }
}