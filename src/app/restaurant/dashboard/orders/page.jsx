'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Clock,
    CheckCircle,
    Truck,
    Utensils,
    XCircle,
    AlertCircle,
    Search,
    Filter
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function RestaurantOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/restaurant/orders');

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

    const updateOrderStatus = async (orderId, newStatus, note = '') => {
        try {
            const response = await fetch(`/api/restaurant/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus, note }),
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

                // Refresh orders list
                fetchOrders();
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
        }
    };

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

    const getStatusActions = (currentStatus) => {
        const actions = {
            pending: ['confirmed', 'cancelled'],
            confirmed: ['preparing', 'cancelled'],
            preparing: ['out_for_delivery', 'cancelled'],
            out_for_delivery: ['delivered'],
            delivered: [],
            cancelled: []
        };

        return actions[currentStatus] || [];
    };




    // Add this useEffect for polling
    useEffect(() => {
        if (orders.length === 0) return;

        // Poll for new orders every 30 seconds
        const interval = setInterval(() => {
            checkForNewOrders();
        }, 30000);

        return () => clearInterval(interval);
    }, [orders.length]);

    const checkForNewOrders = async () => {
        try {
            const response = await fetch('/api/restaurant/orders?countOnly=true');
            const data = await response.json();

            if (data.success && data.count > orders.length) {
                // Show notification for new orders
                if (Notification.permission === 'granted') {
                    new Notification('New Order Received!', {
                        body: `You have ${data.count - orders.length} new order(s)`,
                        icon: '/favicon.ico'
                    });
                }

                // Refresh orders list
                fetchOrders();
            }
        } catch (error) {
            console.error('Error checking for new orders:', error);
        }
    };

    // Request notification permission on component mount
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);







    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const orderDate = new Date(dateString);
        const diffMs = now - orderDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return formatDate(dateString);
    };

    // Filter and search orders
    const filteredOrders = orders.filter(order => {
        const matchesFilter = filter === 'all' || order.status === filter;
        const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const statusCounts = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        out_for_delivery: orders.filter(o => o.status === 'out_for_delivery').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
                    ))}
                </div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-sm p-6 mb-4">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                <p className="text-gray-600 mt-2">Manage and track incoming orders</p>
            </div>

            {/* Error Message */}
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

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                {Object.entries(statusCounts).map(([status, count]) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`p-4 rounded-lg text-center transition-all ${filter === status
                                ? 'bg-green-600 text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300'
                            }`}
                    >
                        <div className="text-2xl font-bold">{count}</div>
                        <div className="text-sm capitalize mt-1">
                            {status === 'all' ? 'All' : status.replace(/_/g, ' ')}
                        </div>
                    </button>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by order number or customer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Filter className="h-5 w-5 text-gray-400" />
                        <span className="text-sm text-gray-600">Filter:</span>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        {orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}
                    </h2>
                    <p className="text-gray-600">
                        {orders.length === 0
                            ? 'Orders from customers will appear here.'
                            : 'Try changing your search or filter criteria.'
                        }
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Order Header */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Order #{order.orderNumber}
                                            </h3>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="ml-1">{order.status.replace(/_/g, ' ').toUpperCase()}</span>
                                            </span>
                                        </div>
                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Customer:</span> {order.customerName}
                                            </div>
                                            <div>
                                                <span className="font-medium">Placed:</span> {formatTimeAgo(order.createdAt)}
                                            </div>
                                            <div>
                                                <span className="font-medium">Total:</span> ${order.total.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 lg:mt-0 lg:ml-4">
                                        <Link
                                            href={`/restaurant/dashboard/orders/${order._id}`}
                                            className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items & Actions */}
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                    {/* Order Items */}
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 mb-3">Items:</h4>
                                        <div className="space-y-2">
                                            {order.items.slice(0, 3).map((item, index) => (
                                                <div key={index} className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-700">
                                                        {item.quantity}x {item.name}
                                                    </span>
                                                    <span className="text-gray-900 font-medium">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="text-sm text-gray-500">
                                                    +{order.items.length - 3} more items
                                                </div>
                                            )}
                                        </div>

                                        {order.specialInstructions && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                <p className="text-sm font-medium text-blue-800">Special Instructions:</p>
                                                <p className="text-sm text-blue-700 mt-1">{order.specialInstructions}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Actions */}
                                    <div className="mt-4 lg:mt-0 lg:ml-6">
                                        <h4 className="font-medium text-gray-900 mb-3">Update Status:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {getStatusActions(order.status).map(action => (
                                                <button
                                                    key={action}
                                                    onClick={() => updateOrderStatus(order._id, action)}
                                                    className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors capitalize"
                                                >
                                                    Mark as {action.replace(/_/g, ' ')}
                                                </button>
                                            ))}
                                            {getStatusActions(order.status).length === 0 && (
                                                <span className="text-sm text-gray-500">No actions available</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}