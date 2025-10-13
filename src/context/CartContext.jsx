'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import Swal from 'sweetalert2';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(
        item => item._id === action.payload._id && item.restaurantId === action.payload.restaurantId
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item._id === action.payload._id && item.restaurantId === action.payload.restaurantId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }]
        };
      }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };

    case 'CLEAR_CART':
      // Remove cart data from localStorage
      localStorage.removeItem('cart');
      localStorage.removeItem('restaurant');

      return {
        ...state,
        items: [],
        restaurant: null
      };

    case 'SET_RESTAURANT':
      return {
        ...state,
        restaurant: action.payload
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload.items || [],
        restaurant: action.payload.restaurant || null
      };

    default:
      return state;
  }
};

const initialState = {
  items: [],
  restaurant: null
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('foodieFrogCart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('foodieFrogCart', JSON.stringify(state));
  }, [state]);

  const addItem = (item, restaurant) => {
    // If adding from a different restaurant, clear the cart first
    if (state.restaurant && state.restaurant._id !== restaurant._id) {
      Swal.fire({
        title: 'Clear Cart?',
        html: `Your cart contains items from <strong>${state.restaurant.name}</strong>. Adding items from <strong>${restaurant.name}</strong> will clear your current cart.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, continue!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // Clear localStorage
          localStorage.removeItem('cart');
          localStorage.removeItem('restaurant');

          dispatch({ type: 'CLEAR_CART' });
          dispatch({ type: 'SET_RESTAURANT', payload: restaurant });
          dispatch({ type: 'ADD_ITEM', payload: item });

          // Show success notification
          Swal.fire({
            title: 'Cart Updated!',
            text: `Added item from ${restaurant.name}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }
      });
    } else {
      if (!state.restaurant) {
        dispatch({ type: 'SET_RESTAURANT', payload: restaurant });
      }
      dispatch({ type: 'ADD_ITEM', payload: item });

      // Show success notification for same restaurant addition
      Swal.fire({
        title: 'Item Added!',
        text: `${item.name} added to cart`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  const removeItem = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items: state.items,
    restaurant: state.restaurant,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}