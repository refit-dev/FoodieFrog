'use client';

import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';

// Initialize Stripe with error handling
let stripePromise;
try {
  if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  } else {
    console.warn('Stripe publishable key not found');
  }
} catch (error) {
  console.error('Error loading Stripe:', error);
}

// Checkout Form Component
function CheckoutForm({ orderData, onSuccess, onError, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage('Stripe not loaded properly');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        await Swal.fire({
          title: 'Payment Failed',
          text: error.message,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ef4444',
        });
        onError(error);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      console.error('Payment error:', error);
      const message = error.message || 'An unexpected error occurred';
      setErrorMessage(message);
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMessage && (
        <div className="text-red-600 text-sm mt-2">{errorMessage}</div>
      )}
      <div className="flex space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : `Pay $${orderData?.total || 0}`}
        </button>
      </div>
    </form>
  );
}

// Main Checkout Page Component
export default function CheckoutPage() {
  const { items, restaurant, getCartTotal, clearCart } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [stripeError, setStripeError] = useState('');

  const [formData, setFormData] = useState({
    deliveryAddress: '',
    phoneNumber: '',
    specialInstructions: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (items.length === 0 && !showPayment) {
      router.push('/restaurants');
    }
  }, [items, router, showPayment]);

  // Check if Stripe is properly configured
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setStripeError('Stripe is not configured. Please check your environment variables.');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const initializePayment = async () => {
    // Check for required fields
    if (!formData.deliveryAddress.trim() || !formData.phoneNumber.trim()) {
      await Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in delivery address and phone number',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    // Check Stripe configuration
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      await Swal.fire({
        title: 'Payment Unavailable',
        text: 'Payment system is currently unavailable. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    setLoading(true);

    try {
      const subtotal = Number(getCartTotal()) || 0;
      const deliveryFee = Number(restaurant?.deliveryFee) || 0;
      const tax = +(subtotal * 0.08).toFixed(2);
      const total = +(subtotal + deliveryFee + tax).toFixed(2);

      const orderData = {
        restaurantId: restaurant._id,
        items: items,
        deliveryAddress: formData.deliveryAddress,
        phoneNumber: formData.phoneNumber,
        specialInstructions: formData.specialInstructions,
        subtotal: parseFloat(subtotal),
        deliveryFee: parseFloat(deliveryFee),
        tax: parseFloat(tax),
        total: parseFloat(total),
      };

      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          orderData: orderData,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setClientSecret(result.clientSecret);
        setOrderData(orderData);
        setShowPayment(true);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error initializing payment:', error);
      await Swal.fire({
        title: 'Payment Error',
        text: error.message || 'Failed to initialize payment',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

const handlePaymentSuccess = async (paymentIntentId) => {
  setLoading(true);

  try {
    // Send only payment intent ID to orders API
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        paymentIntentId: paymentIntentId,
      }),
    });

    const result = await response.json();

    if (result.success) {
      await Swal.fire({
        title: 'Order Placed! 🎉',
        html: `
          <div class="text-center">
            <p class="text-lg mb-2">Your order has been placed successfully!</p>
            <p class="text-sm text-gray-600 mb-4">Order #: <strong>${result.data.orderNumber}</strong></p>
            <p class="text-sm">You can track your order in the "My Orders" section.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'View My Orders',
        confirmButtonColor: '#22c55e',
      });

      clearCart();
      router.push('/orders');
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Error placing order:', error);
    await Swal.fire({
      title: 'Order Failed',
      text: error.message || 'Failed to place order. Please try again.',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#ef4444',
    });
  } finally {
    setLoading(false);
  }
};

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    setLoading(false);
  };

  const handleCancelPayment = () => {
    setShowPayment(false);
    setClientSecret('');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!session || items.length === 0) {
    return null;
  }

  const subtotal = Number(getCartTotal()) || 0;
  const deliveryFee = Number(restaurant?.deliveryFee) || 0;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + deliveryFee + tax).toFixed(2);

  if (showPayment && clientSecret) {
    if (!stripePromise) {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center text-red-600">
                <p>Payment system is not available. Please try again later.</p>
                <button
                  onClick={handleCancelPayment}
                  className="mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Payment</h1>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                },
              }}
            >
              <CheckoutForm
                orderData={orderData}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handleCancelPayment}
              />
            </Elements>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {stripeError && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            {stripeError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary - Same as before */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            {/* Restaurant Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">{restaurant.name}</h3>
              <p className="text-sm text-gray-600">{restaurant.cuisineType}</p>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image || '/food-placeholder.jpg'}
                      alt={item.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form - Same as before */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Delivery Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    placeholder="Enter your complete delivery address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Your phone number for delivery updates"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="2"
                    placeholder="Any special instructions for delivery (e.g., gate code, leave at door)"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={initializePayment}
              disabled={loading || !!stripeError}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Preparing Payment...
                </span>
              ) : (
                `Proceed to Payment - $${total.toFixed(2)}`
              )}
            </button>

            <button
              onClick={() => router.back()}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}