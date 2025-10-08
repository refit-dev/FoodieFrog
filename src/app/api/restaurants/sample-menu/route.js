import { NextResponse } from 'next/server';
import { collectionNamesObj, dbConnect } from '@/lib/dbconnect';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    const { restaurantId } = await request.json();
    
    if (!restaurantId) {
      return NextResponse.json(
        { success: false, message: 'Restaurant ID is required' },
        { status: 400 }
      );
    }

    const menuCollection = await dbConnect(collectionNamesObj.menuCollection);

    const sampleMenuItems = [
      {
        name: "Margherita Pizza",
        description: "Classic pizza with tomato sauce, fresh mozzarella, and basil",
        price: 12.99,
        category: "Pizza",
        restaurantId: new ObjectId(restaurantId),
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop",
        isAvailable: true,
        dietaryInfo: {
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: false,
          isSpicy: false
        },
        preparationTime: 15
      },
      {
        name: "Pepperoni Pizza",
        description: "Traditional pizza with pepperoni and mozzarella cheese",
        price: 14.99,
        category: "Pizza",
        restaurantId: new ObjectId(restaurantId),
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
        isAvailable: true,
        dietaryInfo: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          isSpicy: false
        },
        preparationTime: 15
      },
      {
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with Caesar dressing, croutons, and parmesan",
        price: 8.99,
        category: "Salads",
        restaurantId: new ObjectId(restaurantId),
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
        isAvailable: true,
        dietaryInfo: {
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: false,
          isSpicy: false
        },
        preparationTime: 10
      },
      {
        name: "Spicy Chicken Wings",
        description: "Crispy chicken wings tossed in spicy buffalo sauce",
        price: 11.99,
        category: "Appetizers",
        restaurantId: new ObjectId(restaurantId),
        image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop",
        isAvailable: true,
        dietaryInfo: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          isSpicy: true
        },
        preparationTime: 12
      },
      {
        name: "Chocolate Brownie",
        description: "Warm chocolate brownie with vanilla ice cream",
        price: 6.99,
        category: "Desserts",
        restaurantId: new ObjectId(restaurantId),
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
        isAvailable: true,
        dietaryInfo: {
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: false,
          isSpicy: false
        },
        preparationTime: 5
      }
    ];

    await menuCollection.insertMany(sampleMenuItems);

    return NextResponse.json({ 
      success: true, 
      message: 'Sample menu items added',
      data: { count: sampleMenuItems.length }
    });

  } catch (error) {
    console.error('Error adding sample menu:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add sample menu' },
      { status: 500 }
    );
  }
}