'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Clock, 
  CheckCircle, 
  Truck, 
  Utensils, 
  XCircle, 
  ArrowLeft,
  MapPin,
  Phone,
  User,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function RestaurantOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/restaurant/orders/${params.id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }
      
      const data = JSON.parse(text);
      
      if (data.success) {
        setOrder(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError(error.message || 'Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus, note = '') => {
    setUpdatingStatus(newStatus);
    
    try {
      const response = await fetch(`/api/restaurant/orders/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus, 
          note: note || `Order marked as ${newStatus} by restaurant` 
        }),
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          title: 'Status Updated!',
          text: `Order status changed to ${newStatus}`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#22c55e',
        });

        // Refresh order data
        fetchOrder();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      await Swal.fire({
        title: 'Update Failed',
        text: error.message || 'Failed to update order status',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setUpdatingStatus('');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-6 w-6 text-blue-500" />;
      case 'preparing':
        return <Utensils className="h-6 w-6 text-orange-500" />;
      case 'out_for_delivery':
        return <Truck className="h-6 w-6 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNextStatusActions = (currentStatus) => {
    const statusFlow = {
      pending: [
        { status: 'confirmed', label: 'Confirm Order', color: 'bg-blue-600 hover:bg-blue-700' },
        { status: 'cancelled', label: 'Cancel Order', color: 'bg-red-600 hover:bg-red-700' }
      ],
      confirmed: [
        { status: 'preparing', label: 'Start Preparing', color: 'bg-orange-600 hover:bg-orange-700' },
        { status: 'cancelled', label: 'Cancel Order', color: 'bg-red-600 hover:bg-red-700' }
      ],
      preparing: [
        { status: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-purple-600 hover:bg-purple-700' },
        { status: 'cancelled', label: 'Cancel Order', color: 'bg-red-600 hover:bg-red-700' }
      ],
      out_for_delivery: [
        { status: 'delivered', label: 'Mark as Delivered', color: 'bg-green-600 hover:bg-green-700' }
      ],
      delivered: [],
      cancelled: []
    };
    
    return statusFlow[currentStatus] || [];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <button
            onClick={() => router.push('/restaurant/dashboard/orders')}
            className="flex items-center text-green-600 hover:text-green-700 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Orders
          </button>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Order</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchOrder}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <button
            onClick={() => router.push('/restaurant/dashboard/orders')}
            className="flex items-center text-green-600 hover:text-green-700 mb-6"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Orders
          </button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">❓</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600">The order you're looking for doesn't exist or you don't have access to it.</p>
          </div>
        </div>
      </div>
    );
  }

  const nextStatusActions = getNextStatusActions(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/restaurant/dashboard/orders')}
            className="flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Orders
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
              <p className="text-gray-600 mt-2">Detailed order information and management</p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              {getStatusIcon(order.status)}
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium border ${getStatusColor(order.status)}`}>
                {order.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Timeline</h2>
              
              <div className="space-y-4">
                {order.statusHistory?.map((history, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-green-600' : 'bg-gray-300'
                    }`}>
                      {index === 0 ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : (
                        <CheckCircle className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {history.note || `Order ${history.status}`}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {formatDate(history.timestamp)} at {formatTime(history.timestamp)}
                      </div>
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
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image || '/food-placeholder.jpg'}
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">${item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">${order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Customer Name</p>
                    <p className="text-gray-600">{order.customerName}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Phone Number</p>
                    <p className="text-gray-600">{order.phoneNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Delivery Address</p>
                    <p className="text-gray-600">{order.deliveryAddress}</p>
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

            {/* Order Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Actions</h2>
              
              <div className="space-y-3">
                {nextStatusActions.length > 0 ? (
                  nextStatusActions.map((action) => (
                    <button
                      key={action.status}
                      onClick={() => updateOrderStatus(action.status)}
                      disabled={updatingStatus === action.status}
                      className={`w-full text-white py-3 px-4 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${action.color}`}
                    >
                      {updatingStatus === action.status ? (
                        <span className="flex items-center justify-center">
                          <Clock className="h-5 w-5 animate-spin mr-2" />
                          Updating...
                        </span>
                      ) : (
                        action.label
                      )}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600">No further actions available</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Order is {order.status.replace(/_/g, ' ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Status Info */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Current Status</h3>
                <p className="text-sm text-gray-600">
                  Order was placed on {formatDate(order.createdAt)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Last updated: {formatTimeAgo(order.updatedAt)}
                </p>
              </div>
            </div>

            {/* Order Metadata */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Placed On</span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">{formatTimeAgo(order.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Email</span>
                  <span className="font-medium">{order.customerEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for time ago
function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}