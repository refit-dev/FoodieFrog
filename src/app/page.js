import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to <span className="text-green-600">FoodieFrog</span> 🐸
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Delicious food delivered to your doorstep
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/test">View Test Page</Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/">Explore Restaurants</Link>
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🍕 Restaurants</CardTitle>
            <CardDescription>Browse food listings</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Discover various restaurants and their menus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🛒 Cart & Checkout</CardTitle>
            <CardDescription>Easy ordering system</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Add items to cart and seamless checkout</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📦 Order Tracking</CardTitle>
            <CardDescription>Real-time status updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Track your order from kitchen to delivery</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}