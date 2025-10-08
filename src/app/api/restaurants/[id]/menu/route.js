import { NextResponse } from 'next/server';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } =await params;
    
    // Validate restaurant ID
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid restaurant ID' },
        { status: 400 }
      );
    }

    const menuCollection = await dbConnect(collectionNamesObj.menuCollection);
    
    const menuItems = await menuCollection
      .find({ 
        restaurantId: new ObjectId(id),
        isAvailable: true 
      })
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