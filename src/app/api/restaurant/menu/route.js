import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';

// GET - Fetch all menu items for the restaurant
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const menuCollection = await dbConnect(collectionNamesObj.menuCollection);
    const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);

    // Get restaurant ID for the current user
    const restaurant = await restaurantCollection.findOne({ 
      ownerEmail: session.user.email 
    });

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const menuItems = await menuCollection
      .find({ restaurantId: restaurant._id })
      .sort({ category: 1, name: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: menuItems
    });

  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// POST - Add new menu item
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
    const menuCollection = await dbConnect(collectionNamesObj.menuCollection);
    const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);

    // Get restaurant ID for the current user
    const restaurant = await restaurantCollection.findOne({ 
      ownerEmail: session.user.email 
    });

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const result = await menuCollection.insertOne({
      ...payload,
      restaurantId: restaurant._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Menu item added successfully',
      data: { id: result.insertedId }
    });

  } catch (error) {
    console.error('Error adding menu item:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}