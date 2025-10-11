// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/authOptions';
// import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';
// import { ObjectId } from 'mongodb';

// // POST - Create new order
// export async function POST(req) {
//     try {
//         const session = await getServerSession(authOptions);

//         if (!session) {
//             return NextResponse.json(
//                 { success: false, message: 'Unauthorized' },
//                 { status: 401 }
//             );
//         }

//         const payload = await req.json();
//         const {
//             restaurantId,
//             items,
//             deliveryAddress,
//             phoneNumber,
//             specialInstructions,
//             subtotal,
//             deliveryFee,
//             tax,
//             total
//         } = payload;

//         // Validate required fields
//         if (!restaurantId || !items || items.length === 0 || !deliveryAddress || !phoneNumber) {
//             return NextResponse.json(
//                 { success: false, message: 'Missing required fields' },
//                 { status: 400 }
//             );
//         }

//         const ordersCollection = await dbConnect(collectionNamesObj.orderCollection);
//         const restaurantCollection = await dbConnect(collectionNamesObj.restaurantCollection);

//         // Verify restaurant exists
//         const restaurant = await restaurantCollection.findOne({
//             _id: new ObjectId(restaurantId)
//         });

//         if (!restaurant) {
//             return NextResponse.json(
//                 { success: false, message: 'Restaurant not found' },
//                 { status: 404 }
//             );
//         }

//         // Generate order number
//         const orderCount = await ordersCollection.countDocuments();
//         const orderNumber = `FF${String(orderCount + 1).padStart(6, '0')}`;

//         // Create order
//         const order = {
//             orderNumber,
//             customerId: new ObjectId(session?.user?.id),
//             // customerEmail: session.user.email,
//             customerEmail: session.user.email,
//             customerName: session.user.name,
//             restaurantId: new ObjectId(restaurantId),
//             restaurantName: restaurant.name,
//             items: items.map(item => ({
//                 menuItemId: new ObjectId(item._id),
//                 name: item.name,
//                 price: item.price,
//                 quantity: item.quantity,
//                 image: item.image
//             })),
//             deliveryAddress,
//             phoneNumber,
//             specialInstructions: specialInstructions || '',
//             subtotal,
//             deliveryFee,
//             tax,
//             total,
//             status: 'pending', // pending, confirmed, preparing, out_for_delivery, delivered, cancelled
//             statusHistory: [
//                 {
//                     status: 'pending',
//                     timestamp: new Date(),
//                     note: 'Order placed'
//                 }
//             ],
//             createdAt: new Date(),
//             updatedAt: new Date()
//         };

//         const result = await ordersCollection.insertOne(order);

//         return NextResponse.json({
//             success: true,
//             message: 'Order placed successfully!',
//             data: {
//                 orderId: result.insertedId,
//                 orderNumber: order.orderNumber
//             }
//         });

//     } catch (error) {
//         console.error('Error creating order:', error);
//         return NextResponse.json(
//             { success: false, message: 'Server error' },
//             { status: 500 }
//         );
//     }
// }

// // GET - Get user's orders
// export async function GET() {
//     try {
//         const session = await getServerSession(authOptions);

//         if (!session) {
//             return NextResponse.json(
//                 { success: false, message: 'Unauthorized' },
//                 { status: 401 }
//             );
//         }

//         const ordersCollection = await dbConnect(collectionNamesObj.orderCollection);

//         const orders = await ordersCollection
//             .find({ customerId: new ObjectId(session.user.id) })
//             .sort({ createdAt: -1 })
//             .limit(20)
//             .toArray();

//         return NextResponse.json({
//             success: true,
//             data: orders
//         });

//     } catch (error) {
//         console.error('Error fetching orders:', error);
//         return NextResponse.json(
//             { success: false, message: 'Server error' },
//             { status: 500 }
//         );
//     }
// }

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';
import { ObjectId } from 'mongodb';

// GET - Get user's orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions);


    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const ordersCollection = await dbConnect(
      collectionNamesObj.orderCollection
    );
    const userCollection = await dbConnect(collectionNamesObj.userCollection);

    // Get user from database to ensure we have a valid ObjectId
    const user = await userCollection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const orders = await ordersCollection
      .find({ customerId: user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    // Convert ObjectId to string for client-side
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

// POST - Create new order
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
        console.log('SESSION:', session);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await req.json();
    const {
      restaurantId,
      items,
      deliveryAddress,
      phoneNumber,
      specialInstructions,
      subtotal,
      deliveryFee,
      tax,
      total,
    } = payload;

    // Validate required fields
    if (
      !restaurantId ||
      !items ||
      items.length === 0 ||
      !deliveryAddress ||
      !phoneNumber
    ) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const ordersCollection = await dbConnect(
      collectionNamesObj.orderCollection
    );
    const restaurantCollection = await dbConnect(
      collectionNamesObj.restaurantCollection
    );
    const userCollection = await dbConnect(collectionNamesObj.userCollection);

    // Get user from database to ensure we have a valid ObjectId
    const user = await userCollection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify restaurant exists and get valid ObjectId
    let restaurantObjectId;
    try {
      restaurantObjectId = new ObjectId(restaurantId);
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
    const orderCount = await ordersCollection.countDocuments();
    const orderNumber = `FF${String(orderCount + 1).padStart(6, '0')}`;

    // Create order with proper ObjectIds
    const order = {
      orderNumber,
      customerId: user._id,
      customerEmail: session.user.email,
      customerName: session.user.name,
      restaurantId: restaurantObjectId,
      restaurantName: restaurant.name,
      items: items.map((item) => {
        let menuItemId;
        try {
          menuItemId = new ObjectId(item._id);
        } catch (error) {
          // If item._id is not a valid ObjectId, create a new one
          menuItemId = new ObjectId();
        }

        return {
          menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        };
      }),
      deliveryAddress,
      phoneNumber,
      specialInstructions: specialInstructions || '',
      subtotal: parseFloat(subtotal),
      deliveryFee: parseFloat(deliveryFee),
      tax: parseFloat(tax),
      total: parseFloat(total),
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date(),
          note: 'Order placed',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ordersCollection.insertOne(order);

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
