import Stripe from "stripe";

 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.json();
  const { items, deliveryFee, tax, metadata } = body;

  // Map cart items to Stripe line items
  const line_items = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: [item.image || ''],
      },
      unit_amount: Math.round(item.price * 100), // Stripe expects cents
    },
    quantity: item.quantity,
  }));

  // Add delivery fee and tax as separate line items if needed
  if (deliveryFee > 0) {
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Delivery Fee' },
        unit_amount: Math.round(deliveryFee * 100),
      },
      quantity: 1,
    });
  }
  if (tax > 0) {
    line_items.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Tax' },
        unit_amount: Math.round(tax * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/canceled`,
    metadata: metadata,
  });

  return Response.json({ url: session.url }); // return session URL
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const session_id = searchParams.get('session_id');

  const result = await Promise.all([stripe.checkout.sessions.retrieve(session_id, { expand: ['payment_intent.payment_method'] }), stripe.checkout.sessions.listLineItems(session_id)]);
  console.log(result[0]);

  return Response.json({ message: 'Hello from Checkout API', session: result[0], lineItems: result[1] });
}
