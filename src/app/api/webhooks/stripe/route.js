import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { dbConnect, collectionNamesObj } from '@/lib/dbconnect';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event;

  try {
    if (process.env.NODE_ENV === 'development') {

      try {
        event = stripe.webhooks.constructEvent(
          payload,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
        );
      } catch (error) {

        console.log('Webhook verification failed, parsing JSON directly for development');
        event = JSON.parse(payload);
      }
    } else {
      // Production - always verify
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    }
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    
    // For development
    if (process.env.NODE_ENV === 'development') {
      console.log('Proceeding with unverified webhook in development mode');
      event = JSON.parse(payload);
    } else {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  }

  console.log('Webhook received:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      const ordersCollection = await dbConnect(collectionNamesObj.orderCollection);
      const userCollection = await dbConnect(collectionNamesObj.userCollection);

      // Get user from database
      const user = await userCollection.findOne({ email: session.customer_email });

      if (!user) {
        console.error('User not found for email:', session.customer_email);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const orderData = JSON.parse(session.metadata.orderData);

      // Generate order number
      const orderCount = await ordersCollection.countDocuments();
      const orderNumber = `FF${String(orderCount + 1).padStart(6, '0')}`;

      // Create order
      const order = {
        orderNumber,
        customerId: user._id,
        customerEmail: session.customer_email,
        customerName: session.metadata.customerName,
        restaurantId: new ObjectId(session.metadata.restaurantId),
        restaurantName: session.metadata.restaurantName,
        items: orderData.items.map((item) => ({
          menuItemId: new ObjectId(item.menuItemId),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        deliveryAddress: session.metadata.deliveryAddress,
        phoneNumber: session.metadata.phoneNumber,
        specialInstructions: orderData.specialInstructions || '',
        subtotal: parseFloat(orderData.subtotal),
        deliveryFee: parseFloat(orderData.deliveryFee),
        tax: parseFloat(orderData.tax),
        total: parseFloat(orderData.total),
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'card',
        paymentIntentId: session.payment_intent,
        stripeSessionId: session.id,
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date(),
            note: 'Order placed',
          },
          {
            status: 'confirmed',
            timestamp: new Date(),
            note: 'Payment confirmed via Stripe',
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await ordersCollection.insertOne(order);

      console.log('Order created successfully:', orderNumber);
      
      return NextResponse.json({ 
        success: true, 
        orderNumber,
        message: 'Order created successfully' 
      });
    } catch (error) {
      console.error('Error creating order from webhook:', error);
      return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}