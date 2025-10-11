'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Clock, CheckCircle, Truck, Utensils, MapPin, Phone } from 'lucide-react';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchOrder();
    }
  }, [status, router, params.id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { status: 'pending', label: 'Order Placed', description: 'Your order has been received' },
      { status: 'confirmed', label: 'Order Confirmed', description: 'Restaurant has confirmed your order' },
      { status: 'preparing', label: 'Preparing Food', description: 'Chef is cooking your delicious meal' },
      { status: 'out_for_delivery', label: 'Out for Delivery', description: 'Your food is on the way!' },
      { status: 'delivered', label: 'Delivered', description: 'Enjoy your meal!' }
    ];

    const currentIndex = steps.findIndex(step => step.status === order.status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/orders')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <div className="min-h-screen pt-[74px] bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Order Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/orders')}
            className="flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            ← Back to Orders
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-gray-600 mt-2">Tracking your order from {order.restaurantName}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Tracking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
              
              <div className="space-y-4">
                {statusSteps.map((step, index) => (
                  <div key={step.status} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-600' : 'bg-gray-300'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : (
                        <Clock className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        step.current ? 'text-green-600' : step.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {step.description}
                      </div>
                      {step.current && (
                        <div className="text-xs text-green-600 mt-1 font-medium">
                          Current Status
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image || '/food-placeholder.jpg'}
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>${order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Information Sidebar */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Information</h2>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Delivery Address</p>
                    <p className="text-sm text-gray-600 mt-1">{order.deliveryAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Contact Number</p>
                    <p className="text-sm text-gray-600 mt-1">{order.phoneNumber}</p>
                  </div>
                </div>
              </div>

              {order.specialInstructions && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Special Instructions</p>
                  <p className="text-sm text-blue-700 mt-1">{order.specialInstructions}</p>
                </div>
              )}
            </div>

            {/* Restaurant Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Restaurant</h2>
              
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">{order.restaurantName}</h3>
                <p className="text-sm text-gray-600">Order placed on {formatDate(order.createdAt)}</p>
                
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-900">Need help with your order?</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Contact the restaurant directly for order modifications or questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}