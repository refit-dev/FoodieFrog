import { NextResponse } from 'next/server';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);
    const restaurant = await restaurantCollection.findOne({ 
      _id: new ObjectId(id),
      isActive: true 
    });

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Remove sensitive information
    const { password, ...restaurantData } = restaurant;

    return NextResponse.json({
      success: true,
      data: restaurantData
    });

  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// PATCH to update restaurant rating
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { rating } = await request.json();

    const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);
    
    const result = await restaurantCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          rating: parseFloat(rating),
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Restaurant rating updated successfully'
    });

  } catch (error) {
    console.error('Error updating restaurant rating:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}