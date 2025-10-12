'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RestaurantDashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isRestaurant, setIsRestaurant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkRestaurantStatus = async () => {
      if (status === 'unauthenticated') {
        router.push('/auth/login');
        return;
      }

      if (session?.user?.email) {
        try {
          const response = await fetch('/api/restaurant/check');
          const data = await response.json();
          setIsRestaurant(data.isRestaurant);

          if (!data.isRestaurant && !pathname.includes('restaurant-register')) {
            router.push('/auth/restaurant-register');
          }
        } catch (error) {
          console.error('Error checking restaurant status:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    checkRestaurantStatus();
  }, [session, status, router, pathname]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isRestaurant && !pathname.includes('restaurant-register')) {
    return null;
  }

  const navItems = [
    { href: '/restaurant/dashboard', label: 'Overview', icon: '📊' },
    {
      href: '/restaurant/dashboard/add-restaurant',
      label: 'Update Restaurant info',
      icon: '➕',
    },
    { href: '/restaurant/dashboard/orders', label: 'Orders', icon: '📦' },
    {
      href: '/restaurant/dashboard/menu',
      label: 'Menu Management',
      icon: '🍽️',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 lg:p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg lg:text-xl font-bold text-gray-900">
                  🍴 Restaurant Dashboard
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                  Manage your restaurant
                </p>
              </div>
              {/* Close button for mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3 lg:px-4 py-2 lg:py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2 lg:mr-3 text-base lg:text-lg">
                      {item.icon}
                    </span>
                    <span className="text-xs lg:text-sm">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center px-3 lg:px-4 py-2 text-xs lg:text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
