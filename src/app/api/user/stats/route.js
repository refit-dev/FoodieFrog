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
    const userCollection = await dbConnect(collectionNamesObj.userCollection);

    // Get user from database
    const user = await userCollection.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's orders
    const orders = await ordersCollection
      .find({ customerId: user._id })
      .toArray();

    // Calculate stats
    const totalOrders = orders.length;
    const activeOrders = orders.filter(order => 
      ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status)
    ).length;
    
    const totalSpent = orders.reduce((total, order) => total + order.total, 0);
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length;

    // Get favorite restaurants (most ordered from)
    const restaurantOrders = {};
    orders.forEach(order => {
      const restaurantName = order.restaurantName;
      restaurantOrders[restaurantName] = (restaurantOrders[restaurantName] || 0) + 1;
    });

    const favoriteRestaurant = Object.entries(restaurantOrders)
      .sort(([,a], [,b]) => b - a)[0];

    const stats = {
      totalOrders,
      activeOrders,
      totalSpent,
      deliveredOrders,
      favoriteRestaurant: favoriteRestaurant ? {
        name: favoriteRestaurant[0],
        orderCount: favoriteRestaurant[1]
      } : null,
      memberSince: user.createdAt,
      defaultAddress: user.address || 'No address set'
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}