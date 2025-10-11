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

  // Menu items JSX
  const MenuItems = () => (
    <>
      <Button
        variant="ghost"
        asChild
        className="bg-transparent hover:bg-transparent hover:text-black dark:hover:text-green-500"
      >
        <Link href="/">Home</Link>
      </Button>
      <Button
        variant="ghost"
        asChild
        className="bg-transparent hover:bg-transparent hover:text-black dark:hover:text-green-500"
      >
        <Link href="/restaurants">Restaurants</Link>
      </Button>
      <Button
        variant="ghost"
        asChild
        className="bg-transparent hover:bg-transparent hover:text-black dark:hover:text-green-500"
      >
        <Link href="/faq">Faq</Link>
      </Button>
      <Button
        variant="ghost"
        asChild
        className="bg-transparent hover:bg-transparent hover:text-black dark:hover:text-green-500"
      >
        <Link href="/about">About Us</Link>
      </Button>
      <Button
        variant="ghost"
        asChild
        className="bg-transparent hover:bg-transparent hover:text-black dark:hover:text-green-500"
      >
        <Link href="/contactus">Contact Us</Link>
      </Button>
      {session && (
        <>
          <Button
            variant="ghost"
            asChild
            className="bg-transparent hover:bg-transparent hover:text-black dark:hover:text-green-500"
          >
            <Link href="/orders">My Orders</Link>
          </Button>
          {session.user?.role === 'customer' && (
            <Button
              variant="ghost"
              asChild
              className="bg-transparent hover:bg-transparent hover:text-black dark:hover:text-green-500"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
        </>
      )}
    </>
  );

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-colors duration-300  ${
        isScrolled
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
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>

                {session.user?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {session.user?.role === 'restaurant' && (
                  <DropdownMenuItem asChild>
                    <Link href="/restaurant/dashboard">
                      Restaurant Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                {session.user?.role === 'customer' && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Customer Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {session.user?.role === 'customer' && !isRestaurant && (
                  <DropdownMenuItem asChild>
                    <Link href="/auth/restaurant-register">
                      Become a Restaurant
                    </Link>
                  </DropdownMenuItem>
                )}
                {isRestaurant && (
                  <DropdownMenuItem asChild>
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
                className="bg-transparent hover:bg-transparent hover:text-black dark:hover:text-green-500"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
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
          <MenuItems />
          {session && (
            <>
              {session.user?.role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  className="block px-2 py-1 hover:bg-muted rounded"
                >
                  Admin Dashboard
                </Link>
              )}
              {session.user?.role === 'restaurant' && (
                <Link
                  href="/restaurant/dashboard"
                  className="block px-2 py-1 hover:bg-muted rounded"
                >
                  Restaurant Dashboard
                </Link>
              )}
              {session.user?.role === 'customer' && (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-2 py-1 hover:bg-muted rounded"
                  >
                    Customer Dashboard
                  </Link>
                  {!isRestaurant && (
                    <Link
                      href="/auth/restaurant-register"
                      className="block px-2 py-1 hover:bg-muted rounded"
                    >
                      Become a Restaurant
                    </Link>
                  )}
                </>
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-red-600 px-2 py-1 hover:bg-red-100 rounded text-left"
              >
                Sign Out
              </button>
            </>
          )}
          {!session && (
            <div className="flex flex-col gap-2">
              <Link
                href="/auth/login"
                className="block px-2 py-1 hover:bg-muted rounded"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="block px-2 py-1 hover:bg-muted rounded"
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
