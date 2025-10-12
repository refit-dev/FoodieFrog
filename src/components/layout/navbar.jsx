'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './theme-toggle';
import CartIcon from '../cart/CartIcon';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { data: session, status } = useSession();
  const [isRestaurant, setIsRestaurant] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      // Reset scroll state for non-home pages
      setIsScrolled(true);
    }
  }, [pathname]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isLoading = status === 'loading';

  const getUserInitials = (name) => {
    return (
      name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || 'U'
    );
  };

  useEffect(() => {
    const checkRestaurantStatus = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/restaurant/check');
          const data = await response.json();
          setIsRestaurant(data.isRestaurant);
        } catch (error) {
          console.error('Error checking restaurant status:', error);
        }
      }
    };
    checkRestaurantStatus();
  }, [session]);

  // Function to check if a route is active
  const isActiveRoute = (route) => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  };

  // Function to get active link styles
  const getActiveStyles = (route) => {
    const isActive = isActiveRoute(route);
    const baseStyles = "bg-transparent hover:bg-transparent";
    const activeStyles = isActive
      ? "text-yellow-400 dark:text-green-400 font-bold"
      : "hover:text-green-500 dark:hover:text-green-500 text-black , dark:text-white";
       
    return cn(baseStyles, activeStyles);
  };

  if (!isMounted) {
    return (
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="md:text-2xl text-md font-bold text-primary">
            🐸 FoodieFrog
          </Link>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    );
  }

  // Menu items JSX with active state
  const MenuItems = () => (
    <>
      <Button
        variant="ghost"
        asChild
        className={getActiveStyles('/')}
      >
        <Link href="/">Home</Link>
      </Button>
      <Button
        variant="ghost"
        asChild
        className={getActiveStyles('/restaurants')}
      >
        <Link href="/restaurants">Restaurants</Link>
      </Button>
      <Button
        variant="ghost"
        asChild
        className={getActiveStyles('/faq')}
      >
        <Link href="/faq">Faq</Link>
      </Button>
      <Button
        variant="ghost"
        asChild
        className={getActiveStyles('/about')}
      >
        <Link href="/about">About Us</Link>
      </Button>
      <Button
        variant="ghost"
        asChild
        className={getActiveStyles('/contactus')}
      >
        <Link href="/contactus">Contact Us</Link>
      </Button>
      {session && (
        <>
          <Button
            variant="ghost"
            asChild
            className={getActiveStyles('/orders')}
          >
            <Link href="/orders">My Orders</Link>
          </Button>
          {session.user?.role === 'customer' && (
            <Button
              variant="ghost"
              asChild
              className={getActiveStyles('/dashboard')}
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
        </>
      )}
    </>
  );

  // Function for mobile active styles
  const getMobileActiveStyles = (route) => {
    const isActive = isActiveRoute(route);
    return cn(
      "block px-2 py-1 rounded transition-colors",
      isActive
        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 font-semibold"
        : "hover:bg-gray-100 dark:hover:bg-gray-800"
    );
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-colors duration-300  ${isScrolled
          ? 'bg-white dark:bg-black dark:text-white text-black shadow-md'
          : 'bg-transparent text-white'
        }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="lg:text-2xl text-md font-bold text-primary flex items-center gap-2"
        >
          🐸 FoodieFrog
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4 items-center">
          <MenuItems />
          <ThemeToggle />
          <CartIcon />
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
            </div>
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user?.image}
                      alt={session.user?.name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials(session.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {session.user?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className={isActiveRoute('/profile') ? 'bg-muted' : ''}>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={isActiveRoute('/orders') ? 'bg-muted' : ''}>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>

                {session.user?.role === 'admin' && (
                  <DropdownMenuItem asChild className={isActiveRoute('/admin/dashboard') ? 'bg-muted' : ''}>
                    <Link href="/admin/dashboard">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {session.user?.role === 'customer' && (
                  <DropdownMenuItem asChild className={isActiveRoute('/dashboard') ? 'bg-muted' : ''}>
                    <Link href="/dashboard">Customer Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {session.user?.role === 'customer' && !isRestaurant && (
                  <DropdownMenuItem asChild className={isActiveRoute('/auth/restaurant-register') ? 'bg-muted' : ''}>
                    <Link href="/auth/restaurant-register">
                      Become a Restaurant
                    </Link>
                  </DropdownMenuItem>
                )}
                {isRestaurant && (
                  <DropdownMenuItem asChild className={isActiveRoute('/restaurant/dashboard') ? 'bg-muted' : ''}>
                    <Link href="/restaurant/dashboard">
                      Restaurant Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                asChild
                className={getActiveStyles('/auth/login')}
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild className={getActiveStyles('/auth/register')}>
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <CartIcon />
          <Button variant="ghost" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white text-black dark:bg-black dark:text-white w-full absolute top-full left-0 z-40 flex flex-col items-center p-4 gap-2 border-t border-muted">
          <Link href="/" className={getMobileActiveStyles('/')} onClick={() => setMobileOpen(false)}>
            Home
          </Link>
          <Link href="/restaurants" className={getMobileActiveStyles('/restaurants')} onClick={() => setMobileOpen(false)}>
            Restaurants
          </Link>
          <Link href="/faq" className={getMobileActiveStyles('/faq')} onClick={() => setMobileOpen(false)}>
            Faq
          </Link>
          <Link href="/about" className={getMobileActiveStyles('/about')} onClick={() => setMobileOpen(false)}>
            About Us
          </Link>
          <Link href="/contactus" className={getMobileActiveStyles('/contactus')} onClick={() => setMobileOpen(false)}>
            Contact Us
          </Link>

          {session && (
            <>
              <Link href="/orders" className={getMobileActiveStyles('/orders')} onClick={() => setMobileOpen(false)}>
                My Orders
              </Link>
              <Link href="/profile" className={getMobileActiveStyles('/profile')} onClick={() => setMobileOpen(false)}>
                Profile
              </Link>

              {session.user?.role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  className={getMobileActiveStyles('/admin/dashboard')}
                  onClick={() => setMobileOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              {session.user?.role === 'restaurant' && (
                <Link
                  href="/restaurant/dashboard"
                  className={getMobileActiveStyles('/restaurant/dashboard')}
                  onClick={() => setMobileOpen(false)}
                >
                  Restaurant Dashboard
                </Link>
              )}
              {session.user?.role === 'customer' && (
                <>
                  <Link
                    href="/dashboard"
                    className={getMobileActiveStyles('/dashboard')}
                    onClick={() => setMobileOpen(false)}
                  >
                    Customer Dashboard
                  </Link>
                  {!isRestaurant && (
                    <Link
                      href="/auth/restaurant-register"
                      className={getMobileActiveStyles('/auth/restaurant-register')}
                      onClick={() => setMobileOpen(false)}
                    >
                      Become a Restaurant
                    </Link>
                  )}
                </>
              )}
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' });
                  setMobileOpen(false);
                }}
                className="text-red-600 px-2 py-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-left w-full text-center"
              >
                Sign Out
              </button>
            </>
          )}
          {!session && (
            <div className="flex flex-col gap-2 w-full">
              <Link
                href="/auth/login"
                className={getMobileActiveStyles('/auth/login')}
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className={getMobileActiveStyles('/auth/register')}
                onClick={() => setMobileOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}