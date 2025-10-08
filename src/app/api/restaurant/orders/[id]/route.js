import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';
import { ObjectId } from 'mongodb';

// GET - Get specific order details for restaurant
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } =await params;
    
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

    // Get order and verify it belongs to this restaurant
    const order = await ordersCollection.findOne({
      _id: new ObjectId(id),
      restaurantId: restaurant._id
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Serialize order for client
    const serializedOrder = {
      ...order,
      _id: order._id.toString(),
      customerId: order.customerId.toString(),
      restaurantId: order.restaurantId.toString(),
      items: order.items.map(item => ({
        ...item,
        menuItemId: item.menuItemId.toString()
      }))
    };

    return NextResponse.json({
      success: true,
      data: serializedOrder
    });

  } catch (error) {
    console.error('Error fetching restaurant order:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT - Update order status
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } =await params;
    const { status, note } = await request.json();
    
    if (!status) {
      return NextResponse.json(
        { success: false, message: 'Status is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
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

    // Verify order belongs to this restaurant
    const existingOrder = await ordersCollection.findOne({
      _id: new ObjectId(id),
      restaurantId: restaurant._id
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status
    const statusUpdate = {
      status: status,
      timestamp: new Date(),
      note: note || `Order marked as ${status}`
    };

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        },
        $push: {
          statusHistory: statusUpdate
        }
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: { status: status }
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}