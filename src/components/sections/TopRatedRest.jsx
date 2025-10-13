"use client";

import { useEffect, useState } from "react";
import { Star, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export default function RestaurantCarousel() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch("/api/restaurants");
        const data = await res.json();

        let restaurantList = Array.isArray(data)
          ? data
          : data.restaurants || data.data || [];

        // ✅ Limit to 6 restaurants
        restaurantList = restaurantList.slice(0, 6);
        setRestaurants(restaurantList);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return <RestaurantSkeleton />;
  }

  return (
    <section className="py-16 bg-white dark:bg-black w-full">
      <div className="container mx-auto px-4 w-full">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium mb-4">
            TOP RATED
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
            Discover the Best Restaurants
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our curated selection of top-rated restaurants
          </p>
        </div>

        {/* Restaurant Grid */}
        {restaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">
              No Restaurants Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for amazing restaurants near you
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// Restaurant Card Component (same as above)
function RestaurantCard({ restaurant }) {
  return (
    <Link href={`/restaurants/${restaurant._id}`} className="block w-full h-full">
      <div className="rounded-lg bg-white dark:bg-[#171717] border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Restaurant Image */}
        <div className="relative flex-shrink-0">
          <img
            src={restaurant.image || '/restaurant-placeholder.jpg'}
            alt={restaurant.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = '/restaurant-placeholder.jpg';
            }}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
              FEATURED
            </span>
            {restaurant.rating >= 4 && (
              <span className="bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded">
                TOP RATED
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-1">
              {restaurant.name}
            </h3>
            <div className="flex items-center text-yellow-400 flex-shrink-0 ml-2">
              <Star className="w-4 h-4 fill-yellow-400" />
              <span className="ml-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                {restaurant.rating?.toFixed(1) || "New"}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 flex-1">
            {restaurant.description || restaurant.cuisineType || "Delicious meals"}
          </p>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4 text-green-500" />
              {restaurant.deliveryTime || "30-45 min"}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="w-4 h-4 text-green-500" />
              {restaurant.address?.city || "Near you"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Skeleton Component
function RestaurantSkeleton() {
  return (
    <section className="py-16 bg-white dark:bg-black w-full">
      <div className="container mx-auto px-4 w-full">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-gray-200 rounded-full mb-4 w-32 h-6 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#171717] rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}