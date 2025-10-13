import { NextResponse } from 'next/server';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';

export async function GET() {
  try {
    const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);
    
    const restaurants = await restaurantCollection
      .find({ isActive: true })
      .project({
        name: 1,
        cuisineType: 1,
        image: 1,
        rating: 1,
        deliveryTime: 1,
        deliveryFee: 1,
        minimumOrder: 1,
        'address.city': 1
      })
      .sort({ rating: -1, name: 1 }) // Added sorting for better user experience
      .limit(100) // Increased limit to accommodate pagination needs
      .toArray();

    return NextResponse.json({ success: true, data: restaurants });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'restaurant') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await req.json();
    const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);

    const result = await restaurantCollection.insertOne({
      ...payload,
      ownerId: new ObjectId(session.user.id),
      isActive: true,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Restaurant created successfully',
      data: { id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create restaurant' },
      { status: 500 }
    );
  }
}