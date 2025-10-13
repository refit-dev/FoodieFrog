'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, CheckCircle, Truck, Utensils, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }
      
      const data = JSON.parse(text);
      
      if (data.success) {
        setOrders(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'preparing':
        return <Utensils className="h-5 w-5 text-orange-500" />;
      case 'out_for_delivery':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'preparing':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
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

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 mb-4">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[74px] bg-gray-50 dark:bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Track your recent food orders</p>
          
          {/* Orders Count */}
          {orders.length > 0 && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, orders.length)} of {orders.length} orders
              </p>
              
              {/* Items per page selector - removed since we fixed it to 5 */}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-800">{error}</span>
            </div>
            <button
              onClick={fetchOrders}
              className="mt-2 bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {orders.length === 0 && !error ? (
          <div className="bg-white dark:bg-[#171717] rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-12 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">No orders yet</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Start by placing your first order from our restaurants!</p>
            <Link
              href="/restaurants"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {currentOrders.map(order => (
                <div key={order._id} className="bg-white dark:bg-[#171717] rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-md transition-shadow duration-300">
                  {/* Desktop Layout - Image on left, content on right */}
                  <div className="hidden md:flex">
                    {/* Food Images Gallery - Desktop */}
                    <div className="w-2/5 min-h-[200px] bg-gray-100 dark:bg-gray-800">
                      <div className="grid grid-cols-2 grid-rows-2 h-full">
                        {order.items.slice(0, 4).map((item, index) => (
                          <div 
                            key={index} 
                            className={`relative overflow-hidden ${
                              order.items.length === 1 ? 'col-span-2 row-span-2' :
                              order.items.length === 2 ? 'col-span-1 row-span-1' :
                              order.items.length === 3 && index === 0 ? 'col-span-2 row-span-1' : 'col-span-1 row-span-1'
                            }`}
                          >
                            <img
                              src={item.image || '/food-placeholder.jpg'}
                              alt={item.name}
                              className="w-full  h-96 object-cover hover:scale-105 transition-transform duration-300"
                            />
                            {order.items.length > 4 && index === 3 && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  +{order.items.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details - Desktop */}
                    <div className="w-3/5 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Order #{order.orderNumber}
                          </h3>
                          <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{order.restaurantName}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Placed on {formatDate(order.createdAt)}
                      </p>

                      {/* Order Items List */}
                      <div className="space-y-3 mb-4">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium">
                                {item.quantity}
                              </div>
                              <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                            +{order.items.length - 3} more items
                          </div>
                        )}
                      </div>

                      {/* Order Footer */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            🚚 {order.deliveryAddress}
                          </p>
                          {order.specialInstructions && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                              📝 {order.specialInstructions}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            ${order.total.toFixed(2)}
                          </p>
                          <Link
                            href={`/orders/${order._id}`}
                            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm mt-1 transition-colors"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Layout - Stacked */}
                  <div className="md:hidden">
                    {/* Food Images Carousel - Mobile */}
                    <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                      <div className="flex h-full">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex-shrink-0 w-full h-full">
                            <img
                              src={item.image || '/food-placeholder.jpg'}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      {order.items.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {order.items.slice(0, 3).map((_, index) => (
                            <div key={index} className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                          ))}
                        </div>
                      )}
                      {order.items.length > 3 && (
                        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    {/* Order Details - Mobile */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Order #{order.orderNumber}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{order.restaurantName}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        {formatDate(order.createdAt)}
                      </p>

                      {/* Quick Items Preview */}
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {order.items.slice(0, 3).map((item, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm text-gray-700 dark:text-gray-300"
                            >
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                          {order.items.length > 3 && (
                            <span className="inline-flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm text-gray-500 dark:text-gray-400">
                              +{order.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Order Footer - Mobile */}
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex-1">
                          <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                            {order.deliveryAddress}
                          </p>
                        </div>
                        <div className="text-right ml-2">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            ${order.total.toFixed(2)}
                          </p>
                          <Link
                            href={`/orders/${order._id}`}
                            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-xs mt-1"
                          >
                            Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </p>
                
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === number
                            ? 'bg-green-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
                    }`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}