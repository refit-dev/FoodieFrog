'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  DollarSign,
  TrendingUp,
  Utensils,
  Edit3,
  List
} from 'lucide-react';

export default function RestaurantDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchRestaurantData();
    fetchDashboardStats();
    fetchRecentOrders();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      const response = await fetch('/api/restaurant/my-restaurant');
      const data = await response.json();
      
      if (data.success) {
        setRestaurant(data.data);
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch('/api/restaurant/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setStatsLoading(false);
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch('/api/restaurant/orders?limit=5');
      const data = await response.json();
      
      if (data.success) {
        setRecentOrders(data.data.slice(0, 5)); // Get only 5 most recent orders
      }
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
        <div className="bg-gray-200 rounded-lg h-64"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back{restaurant ? `, ${restaurant.name}` : ''}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your restaurant and track your performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {statsLoading ? '...' : stats.totalOrders}
              </p>
              <p className="text-xs text-gray-500 mt-1">All time orders</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>All orders received</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {statsLoading ? '...' : stats.pendingOrders}
              </p>
              <p className="text-xs text-gray-500 mt-1">Need attention</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link 
              href="/restaurant/dashboard/orders?filter=pending"
              className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
            >
              View pending orders →
            </Link>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {statsLoading ? '...' : stats.completedOrders}
              </p>
              <p className="text-xs text-gray-500 mt-1">Delivered orders</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <span>Successfully delivered</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {statsLoading ? '...' : formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-xs text-gray-500 mt-1">From delivered orders</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>Lifetime earnings</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders & Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                <Link 
                  href="/restaurant/dashboard/orders"
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  View all orders →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600">Orders from customers will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status.replace(/_/g, ' ')}
                          </span>
                          <span className="font-medium text-gray-900">#{order.orderNumber}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.customerName} • {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                        <Link 
                          href={`/restaurant/dashboard/orders/${order._id}`}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/restaurant/dashboard/orders"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <List className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Manage Orders</p>
                  <p className="text-sm text-gray-600">View and process orders</p>
                </div>
              </Link>

              <Link
                href="/restaurant/dashboard/menu"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                  <Utensils className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Manage Menu</p>
                  <p className="text-sm text-gray-600">Add and edit menu items</p>
                </div>
              </Link>

              <Link
                href="/restaurant/dashboard/add-restaurant"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <Edit3 className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Restaurant Settings</p>
                  <p className="text-sm text-gray-600">Update your information</p>
                </div>
              </Link>

              <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">Earnings Overview</p>
                  <p className="text-sm text-gray-600">{formatCurrency(stats.totalRevenue)} total</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Information */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Restaurant Information</h2>
            
            {restaurant ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {restaurant.image && (
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                    <p className="text-gray-600">{restaurant.cuisineType}</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="font-medium text-gray-600">Address</label>
                    <p className="text-gray-900 mt-1">
                      {restaurant.address?.street || 'Not set'}
                      {restaurant.address?.city && `, ${restaurant.address.city}`}
                    </p>
                  </div>
                  
                  <div>
                    <label className="font-medium text-gray-600">Phone</label>
                    <p className="text-gray-900 mt-1">{restaurant.phone}</p>
                  </div>
                  
                  <div>
                    <label className="font-medium text-gray-600">Delivery Time</label>
                    <p className="text-gray-900 mt-1">{restaurant.deliveryTime}</p>
                  </div>

                  <div>
                    <label className="font-medium text-gray-600">Delivery Fee</label>
                    <p className="text-gray-900 mt-1">{formatCurrency(restaurant.deliveryFee || 0)}</p>
                  </div>
                </div>

                <Link
                  href="/restaurant/dashboard/add-restaurant"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Edit Restaurant Info
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Restaurant Added</h3>
                <p className="text-gray-600 mb-4">Add your restaurant to start receiving orders</p>
                <Link
                  href="/restaurant/dashboard/add-restaurant"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Add Your Restaurant
                </Link>
              </div>
            )}
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold text-gray-900">
                  {stats.totalOrders > 0 
                    ? `${Math.round((stats.completedOrders / stats.totalOrders) * 100)}%`
                    : '0%'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Order Value</span>
                <span className="font-semibold text-gray-900">
                  {stats.completedOrders > 0
                    ? formatCurrency(stats.totalRevenue / stats.completedOrders)
                    : formatCurrency(0)
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Orders</span>
                <span className="font-semibold text-gray-900">{stats.pendingOrders}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}