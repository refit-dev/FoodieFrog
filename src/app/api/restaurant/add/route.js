import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';

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
    const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);

    // Check if restaurant already exists for this user
    const existingRestaurant = await restaurantCollection.findOne({ 
      ownerEmail: session.user.email 
    });

    if (existingRestaurant) {
      return NextResponse.json(
        { success: false, message: 'You already have a restaurant' },
        { status: 400 }
      );
    }

    const result = await restaurantCollection.insertOne({
      ...payload,
      ownerEmail: session.user.email,
      ownerId: session.user.id,
      isActive: true,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Restaurant added successfully',
      data: { id: result.insertedId }
    });

  } catch (error) {
    console.error('Error adding restaurant:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}