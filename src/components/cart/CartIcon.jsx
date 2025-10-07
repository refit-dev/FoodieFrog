'use client';

 
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';
 
 
import CartSidebar from '../../components/cart/CartSidebar';
import { useCart } from '@/context/CartContext';
 

export default function CartIcon() {
  const { getItemCount } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const itemCount = getItemCount();

  return (
    <>
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="relative p-2 hover:text-black bg-transparent hover:bg-transparent dark:hover:text-green-500 dark:hover:bg-black/20 rounded-lg"
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      <CartSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </>
  );
}