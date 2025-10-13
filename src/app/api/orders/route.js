import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';
import { ObjectId } from 'mongodb';
import { stripe } from '@/lib/stripe';
import { deleteTempOrder, getTempOrder } from '@/lib/order-temp-store';

// GET - Get user's orders (filter out temp orders)
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

    const user = await userCollection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Only get real orders, not temp ones
    const orders = await ordersCollection
      .find({ 
        customerId: user._id,
        isTemp: { $ne: true } // Exclude temp orders
      })
      .sort({ createdAt: -1 })
      .limit(50) // Increased limit to accommodate pagination
      .toArray();

    const serializedOrders = orders.map((order) => ({
      ...order,
      _id: order._id.toString(),
      customerId: order.customerId.toString(),
      restaurantId: order.restaurantId.toString(),
      items: order.items.map((item) => ({
        ...item,
        menuItemId: item.menuItemId.toString(),
      })),
    }));

    return NextResponse.json({
      success: true,
      data: serializedOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}

// POST - Create new order with payment verification
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
    const { paymentIntentId } = payload;

    // Validate required fields
    if (!paymentIntentId) {
      return NextResponse.json(
        { success: false, message: 'Payment intent ID required' },
        { status: 400 }
      );
    }

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { success: false, message: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Retrieve order data from temporary storage
    const orderData = await getTempOrder(paymentIntentId);
    
    if (!orderData) {
      return NextResponse.json(
        { success: false, message: 'Order data not found or expired. Please try placing the order again.' },
        { status: 400 }
      );
    }

    // Verify payment amount matches order total
    const expectedAmount = Math.round(orderData.total * 100);
    if (paymentIntent.amount !== expectedAmount) {
      return NextResponse.json(
        { success: false, message: 'Payment amount mismatch' },
        { status: 400 }
      );
    }

    const ordersCollection = await dbConnect(collectionNamesObj.orderCollection);
    const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);
    const userCollection = await dbConnect(collectionNamesObj.userCollection);

    const user = await userCollection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    let restaurantObjectId;
    try {
      restaurantObjectId = new ObjectId(orderData.restaurantId);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid restaurant ID' },
        { status: 400 }
      );
    }

    const restaurant = await restaurantCollection.findOne({
      _id: restaurantObjectId,
    });

    if (!restaurant) {
      return NextResponse.json(
        { success: false, message: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Generate order number
    const orderCount = await ordersCollection.countDocuments({
      isTemp: { $ne: true } // Only count real orders
    });
    const orderNumber = `FF${String(orderCount + 1).padStart(6, '0')}`;

    // Create the final order document
    const order = {
      orderNumber,
      customerId: user._id,
      customerEmail: session.user.email,
      customerName: session.user.name,
      restaurantId: restaurantObjectId,
      restaurantName: restaurant.name,
      items: orderData.items.map((item) => {
        let menuItemId;
        try {
          menuItemId = new ObjectId(item._id);
        } catch (error) {
          menuItemId = new ObjectId();
        }

        return {
          menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '/food-placeholder.jpg',
        };
      }),
      deliveryAddress: orderData.deliveryAddress,
      phoneNumber: orderData.phoneNumber,
      specialInstructions: orderData.specialInstructions || '',
      subtotal: parseFloat(orderData.subtotal),
      deliveryFee: parseFloat(orderData.deliveryFee),
      tax: parseFloat(orderData.tax),
      total: parseFloat(orderData.total),
      payment: {
        paymentIntentId,
        amount: orderData.total,
        currency: 'usd',
        status: 'completed',
        method: 'card',
        paidAt: new Date(),
      },
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date(),
          note: 'Order placed - Payment received',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Start a transaction to ensure data consistency
    const result = await ordersCollection.insertOne(order);
    
    // Delete the temporary order after successful creation
    await deleteTempOrder(paymentIntentId);

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully!',
      data: {
        orderId: result.insertedId.toString(),
        orderNumber: order.orderNumber,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Server error: ' + error.message },
      { status: 500 }
    );
  }
}