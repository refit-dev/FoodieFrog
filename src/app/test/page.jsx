import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">FoodieFrog Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Buttons Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons Demo</CardTitle>
            <CardDescription>Different button variants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Form Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Form Demo</CardTitle>
            <CardDescription>Input fields with labels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter your password" />
            </div>
            <Button className="w-full">Submit</Button>
          </CardContent>
        </Card>

        {/* Card 3: FoodieFrog Info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>FoodieFrog Platform Features</CardTitle>
            <CardDescription>What we're building</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Restaurant & food listing</li>
              <li>Add to cart + checkout system</li>
              <li>Order tracking (pending, preparing, delivered)</li>
              <li>Payment integration (Stripe/SSLCommerz)</li>
              <li>Admin dashboard</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}