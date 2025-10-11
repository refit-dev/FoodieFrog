"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Star, Clock, MapPin } from "lucide-react";
import Link from "next/link";

export default function RestaurantCarousel() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch("/api/restaurants");
        const data = await res.json();

        // ✅ Support both possible backend structures
        const restaurantList = Array.isArray(data)
          ? data
          : data.restaurants || data.data || [];

        setRestaurants(restaurantList);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-sm font-medium mb-4">
            TOP RATED
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            Discover the Best Restaurants Near You
          </h2>
          
        </div>

        {/* ✅ Check if data exists before rendering Swiper */}
        {restaurants.length > 0 ? (
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={3}
            navigation
            loop
            className="pb-10"
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {restaurants.map((restaurant) => (
              <SwiperSlide key={restaurant._id}>
                <Link href={`/restaurants/${restaurant._id}`}>
                  <div className="rounded-lg bg-white dark:bg-[#171717] dark:border shadow hover:shadow-lg transition overflow-hidden">
                    {/* Restaurant Image */}
                    <div className="relative">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-60 object-cover"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                          FEATURED
                        </span>
                        <span className="bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded">
                          TOP RATED
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                          {restaurant.name}
                        </h3>
                        <div className="flex items-center text-yellow-400">
                          <Star className="w-4 h-4 fill-yellow-400" />
                          <span className="ml-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {restaurant.rating?.toFixed(1) || "New"}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {restaurant.cuisine || "Delicious meals"}
                      </p>

                      {/* Info icons */}
                      <div className="flex items-center gap-5 mt-4 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-green-500" />{" "}
                          {restaurant.deliveryTime || "30 min"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-green-500" />{" "}
                          {restaurant.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="min-h-screen  bg-gray-50 py-8">
            <div className="container mx-auto px-4">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
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
        )}
      </div>
    </section>
  );
}
