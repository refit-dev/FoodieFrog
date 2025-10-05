'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RestaurantDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchRestaurantData();
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
    } finally {
      setLoading(false);
    }
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
    <div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Restaurant Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Restaurant Information</h2>
          
          {restaurant ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Restaurant Name</label>
                <p className="text-lg font-semibold text-gray-900">{restaurant.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Cuisine Type</label>
                <p className="text-gray-900">{restaurant.cuisineType}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-gray-900">{restaurant.address?.street || 'Not set'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-gray-900">{restaurant.phone}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Delivery Time</label>
                <p className="text-gray-900">{restaurant.deliveryTime}</p>
              </div>

              <Link
                href="/restaurant/dashboard/add-restaurant"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
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

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              href="/restaurant/dashboard/add-restaurant"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-4">➕</span>
              <div>
                <p className="font-medium text-gray-900">Update Restaurant Details</p>
                <p className="text-sm text-gray-600">Set up your restaurant information</p>
              </div>
            </Link>

            <Link
              href="/restaurant/dashboard/menu"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-4">🍽️</span>
              <div>
                <p className="font-medium text-gray-900">Manage Menu</p>
                <p className="text-sm text-gray-600">Add and edit menu items</p>
              </div>
            </Link>

            <Link
              href="/restaurant/dashboard/orders"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-4">📦</span>
              <div>
                <p className="font-medium text-gray-900">View Orders</p>
                <p className="text-sm text-gray-600">Manage incoming orders</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}