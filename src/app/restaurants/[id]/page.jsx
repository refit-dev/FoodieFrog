'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, Clock, DollarSign, MapPin, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function RestaurantPage() {
  const params = useParams();
  const restaurantId = params.id;

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const { addItem, restaurant: cartRestaurant } = useCart();

  useEffect(() => {
    fetchRestaurantData();
  }, [restaurantId]);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);

      // Fetch restaurant details
      const restaurantResponse = await fetch(`/api/restaurants/${restaurantId}`);
      const restaurantData = await restaurantResponse.json();

      if (restaurantData.success) {
        setRestaurant(restaurantData.data);

        // Fetch menu items for this restaurant
        const menuResponse = await fetch(`/api/restaurants/${restaurantId}/menu`);
        const menuData = await menuResponse.json();

        if (menuData.success) {
          setMenuItems(menuData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from menu items
  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  // Filter menu items by category
  const filteredMenuItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h1>
          <p className="text-gray-600">The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Restaurant Image */}
            <div className="lg:w-1/3">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={restaurant.image || '/restaurant-placeholder.jpg'}
                  alt={restaurant.name}
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="lg:w-2/3">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="ml-1 text-gray-700 font-medium">
                    {restaurant.rating || 'New'}
                  </span>
                </div>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-gray-600 capitalize">{restaurant.cuisineType}</span>
              </div>

              <p className="text-gray-700 mb-6">{restaurant.description}</p>

              {/* Restaurant Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{restaurant.deliveryTime}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-5 w-5 mr-2" />
                  <span>Delivery: ${restaurant.deliveryFee || '0.00'}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{restaurant.address?.street}, {restaurant.address?.city}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>{restaurant.phone}</span>
                </div>
              </div>

              {restaurant.minimumOrder > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm">
                    Minimum order: ${restaurant.minimumOrder}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Menu</h2>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {category === 'all' ? 'All Items' : category}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍕</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No menu items found</h3>
              <p className="text-gray-600">
                {activeCategory === 'all'
                  ? 'This restaurant has no menu items yet.'
                  : `No ${activeCategory} items available.`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map(item => (
                <div key={item._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img
                      src={item.image || '/food-placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                      <span className="text-green-600 font-bold">${item.price}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                    {/* Dietary Info */}
                    {item.dietaryInfo && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.dietaryInfo.isVegetarian && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Vegetarian</span>
                        )}
                        {item.dietaryInfo.isVegan && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Vegan</span>
                        )}
                        {item.dietaryInfo.isGlutenFree && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Gluten Free</span>
                        )}
                        {item.dietaryInfo.isSpicy && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Spicy</span>
                        )}
                      </div>
                    )}

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addItem(
                        { ...item, restaurantId: restaurant._id },
                        restaurant
                      )}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Add to Cart
                    </button>

                  </div>

                </div>
              ))}
              
              {cartRestaurant && cartRestaurant._id !== restaurant._id && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Cart Contains Items from Another Restaurant
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Your cart has items from <strong>{cartRestaurant.name}</strong>.
                          Adding items from <strong>{restaurant.name}</strong> will clear your current cart.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>


          )}
        </div>
      </div>
    </div>
  );
}