"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { ThemeToggle } from "./theme-toggle"
import CartIcon from "../cart/CartIcon"

export function Navbar() {
  const { data: session, status } = useSession()
  const [isRestaurant, setIsRestaurant] = useState(false);
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isLoading = status === "loading"

  const getUserInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"
  }
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
          <Link href="/" className="text-2xl font-bold text-primary">
            🐸 FoodieFrog
          </Link>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          🐸 FoodieFrog
        </Link>

        <div className="flex gap-4 items-center">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/restaurants">Restaurants</Link>
          </Button>

          {session && (
            <>
              <Button variant="ghost" asChild>
                <Link href="/orders">My Orders</Link>
              </Button>
              {session.user?.role === 'customer' && (
                <Button variant="ghost" asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              )}
            </>
          )}

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
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image} alt={session.user?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials(session.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user?.name}</p>
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

                {/* Role-based navigation */}
                {session.user?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {session.user?.role === 'restaurant' && (
                  <DropdownMenuItem asChild>
                    <Link href="/restaurant/dashboard">Restaurant Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {session.user?.role === 'customer' && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Customer Dashboard</Link>
                  </DropdownMenuItem>
                )}

                {/* Restaurant registration link for customers */}
                {session.user?.role === 'customer' && !isRestaurant && (
                  <DropdownMenuItem asChild>
                    <Link href="/auth/restaurant-register">Become a Restaurant</Link>
                  </DropdownMenuItem>
                )}

                {isRestaurant && (
                  <DropdownMenuItem asChild>
                    <Link href="/restaurant/dashboard">Restaurant Dashboard</Link>
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
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}