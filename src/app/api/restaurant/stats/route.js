import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
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

    // Get all orders for this restaurant
    const orders = await ordersCollection
      .find({ restaurantId: restaurant._id })
      .toArray();

    // Calculate statistics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => 
      ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status)
    ).length;
    const completedOrders = orders.filter(order => 
      order.status === 'delivered'
    ).length;
    const totalRevenue = orders
      .filter(order => order.status === 'delivered') // Only count delivered orders for revenue
      .reduce((sum, order) => sum + order.total, 0);

    const stats = {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: parseFloat(totalRevenue.toFixed(2))
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching restaurant stats:', error);
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}