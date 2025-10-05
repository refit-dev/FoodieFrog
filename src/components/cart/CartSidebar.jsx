'use client';

import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export default function CartSidebar({ isOpen, onClose }) {
  const {
    items,
    restaurant,
    updateQuantity,
    removeItem,
    getCartTotal,
    getItemCount,
    clearCart
  } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const handleCheckout = () => {
    if (!session) {
      router.push('/auth/login');
      onClose();
      return;
    }
    router.push('/checkout');
    onClose();
  };

  const subtotal = Number(getCartTotal()) || 0;
  const deliveryFee = Number(restaurant?.deliveryFee) || 0;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + deliveryFee + tax).toFixed(2);

  console.log(subtotal, deliveryFee, tax, total);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md w-full flex flex-col p-0 h-full">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <SheetTitle className="text-lg font-semibold">
                Your Cart
                <Badge variant="secondary" className="ml-2">
                  {getItemCount()}
                </Badge>
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Restaurant Info */}
          {/* {restaurant && (
            <Card className="m-4">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm">{restaurant.name}</h3>
                <p className="text-xs text-muted-foreground">{restaurant.cuisineType}</p>
              </CardContent>
            </Card>
          )} */}

          {/* Cart Items */}
          <ScrollArea className="px-4 pb-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">Add some delicious items to get started!</p>
                <Button onClick={onClose} className="bg-primary hover:bg-primary/90">
                  Browse Restaurants
                </Button>
              </div>
            ) : (
              <div className="space-y-3 py-2">
                {items.map((item) => (
                  <Card key={item._id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        {/* Item Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={item.image || '/food-placeholder.jpg'}
                            alt={item.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                ${item.price}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item._id)}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-semibold text-sm">
                              ${(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Footer - Order Summary & Checkout */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4 bg-muted/5 sticky bottom-0">
            {/* Order Summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-medium">${deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span className="font-medium">${tax}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-semibold"
                size="lg"
              >
                {session ? 'Proceed to Checkout' : 'Sign In to Checkout'}
              </Button>

              <Button
                onClick={clearCart}
                variant="outline"
                className="w-full h-10"
                size="sm"
              >
                Clear Cart
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
