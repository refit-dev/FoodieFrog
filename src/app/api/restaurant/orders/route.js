import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';
import { ObjectId } from 'mongodb';

// GET - Fetch all orders for the restaurant
// Update the GET function to handle count parameter
// GET - Fetch all orders for the restaurant
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const countOnly = searchParams.get('countOnly') === 'true';
    const limit = parseInt(searchParams.get('limit')) || 0;

    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const ordersCollection = await dbConnect(collectionNamesObj.orderCollection);
    const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);

    // Get restaurant for current user
    const restaurant = await restaurantCollection.findOne({ 
      ownerEmail: session.user.email 
    });

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: 'Restaurant not found' },
        { status: 404 }
      );
    }

    if (countOnly) {
      const count = await ordersCollection.countDocuments({ 
        restaurantId: restaurant._id 
      });
      
      return NextResponse.json({
        success: true,
        count: count
      });
    }

    // Build query with optional limit
    let query = ordersCollection
      .find({ restaurantId: restaurant._id })
      .sort({ createdAt: -1 });

    if (limit > 0) {
      query = query.limit(limit);
    }

    const orders = await query.toArray();

    // Serialize orders for client
    const serializedOrders = orders.map(order => ({
      ...order,
      _id: order._id.toString(),
      customerId: order.customerId.toString(),
      restaurantId: order.restaurantId.toString(),
      items: order.items.map(item => ({
        ...item,
        menuItemId: item.menuItemId.toString()
      }))
    }));

    return NextResponse.json({
      success: true,
      data: serializedOrders
    });

  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}