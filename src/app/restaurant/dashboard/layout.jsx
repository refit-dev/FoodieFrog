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
    { href: '/restaurant/dashboard/add-restaurant', label: 'Update Restaurant info', icon: '➕' },
    { href: '/restaurant/dashboard/orders', label: 'Orders', icon: '📦' },
    { href: '/restaurant/dashboard/menu', label: 'Menu Management', icon: '🍽️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">🍴 Restaurant Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your restaurant</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <Link
              href="/"
              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}