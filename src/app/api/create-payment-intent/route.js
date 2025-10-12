import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { stripe } from '@/lib/stripe';
import { storeTempOrder } from '@/lib/order-temp-store';
 

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { amount, orderData } = await req.json();

    // Validate amount
    if (!amount || amount < 1) {
      return NextResponse.json(
        { success: false, message: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create PaymentIntent with minimal metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        customerEmail: session.user.email,
        restaurantId: orderData.restaurantId,
        totalAmount: amount.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Store full order data temporarily in database
    await storeTempOrder(paymentIntent.id, {
      ...orderData,
      customerEmail: session.user.email,
      customerName: session.user.name,
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Payment processing error' 
      },
      { status: 500 }
    );
  }
}