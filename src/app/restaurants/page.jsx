'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Search, Star, Clock, DollarSign, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

export default function RestaurantsPage() {
  const { data: session } = useSession();
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const RESTAURANTS_PER_PAGE = 9;

  useEffect(() => {
    fetchRestaurants();
    if (session) {
      fetchFavorites();
    }
  }, [session]);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants');
      const data = await response.json();

      if (data.success) {
        setRestaurants(data.data);
        setTotalPages(Math.ceil(data.data.length / RESTAURANTS_PER_PAGE));
      } else {
        console.error('Failed to fetch restaurants:', data.message);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites');
      const data = await response.json();
      
      if (data.success) {
        setFavorites(data.data.map(fav => fav.restaurantId));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (restaurantId, isCurrentlyFavorite) => {
    if (!session) {
      alert('Please login to add favorites');
      return;
    }

    try {
      if (isCurrentlyFavorite) {
        // Remove from favorites
        const response = await fetch('/api/favorites', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ restaurantId }),
        });

        const data = await response.json();
        
        if (data.success) {
          setFavorites(prev => prev.filter(id => id !== restaurantId));
        } else {
          console.error('Failed to remove favorite:', data.message);
        }
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ restaurantId }),
        });

        const data = await response.json();
        
        if (data.success) {
          setFavorites(prev => [...prev, restaurantId]);
        } else {
          console.error('Failed to add favorite:', data.message);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const cuisines = [...new Set(restaurants.map(r => r.cuisineType))];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = !selectedCuisine || restaurant.cuisineType === selectedCuisine;

    return matchesSearch && matchesCuisine;
  });

  // Calculate pagination for filtered results
  const filteredTotalPages = Math.ceil(filteredRestaurants.length / RESTAURANTS_PER_PAGE);
  const currentFilteredPage = Math.min(currentPage, filteredTotalPages || 1);

  // Get current restaurants to display
  const indexOfLastRestaurant = currentFilteredPage * RESTAURANTS_PER_PAGE;
  const indexOfFirstRestaurant = indexOfLastRestaurant - RESTAURANTS_PER_PAGE;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCuisine]);

  // Update total pages when filtered results change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredRestaurants.length / RESTAURANTS_PER_PAGE));
  }, [filteredRestaurants.length]);

  const handlePreviousPage = () => {
    if (currentFilteredPage > 1) {
      setCurrentPage(currentFilteredPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentFilteredPage < filteredTotalPages) {
      setCurrentPage(currentFilteredPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-gray-black bg-gray-50 py-8">
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
    );
  }

  return (
    <div className="min-h-screen pt-[74px] bg-gray-50 dark:bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discover Restaurants</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Find your favorite food delivered fast</p>
          </div>
          {session && (
            <Link
              href="/favorites"
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Heart className="h-5 w-5 mr-2 fill-current" />
              My Favorites
            </Link>
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-[#171717] rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants or cuisines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Cuisine Filter */}
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Cuisines</option>
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing {currentRestaurants.length} of {filteredRestaurants.length} restaurants
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Page {currentFilteredPage} of {filteredTotalPages || 1}
          </p>
        </div>

        {/* Restaurants Grid */}
        {currentRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">No restaurants found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentRestaurants.map(restaurant => {
                const isFavorite = favorites.includes(restaurant._id);
                
                return (
                  <div key={restaurant._id} className="bg-white dark:bg-[#171717] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden relative">
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(restaurant._id, isFavorite)}
                      className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all ${
                        isFavorite 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white text-gray-400 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      <Heart 
                        className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} 
                      />
                    </button>

                    <Link href={`/restaurants/${restaurant._id}`}>
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-[#171717]">
                        <img
                          src={restaurant.image || '/restaurant-placeholder.jpg'}
                          alt={restaurant.name}
                          className="w-full h-48 object-cover"
                        />
                      </div>

                      <div className="p-4 dark:bg-[#171717]">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-200 truncate">
                            {restaurant.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1">{restaurant.rating || 'New'}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-3">{restaurant.cuisineType}</p>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{restaurant.deliveryTime}</span>
                          </div>

                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            <span>Delivery: ${restaurant.deliveryFee || '0.00'}</span>
                          </div>
                        </div>

                        {restaurant.minimumOrder > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            Min. order: ${restaurant.minimumOrder}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {filteredTotalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentFilteredPage === 1}
                  className={`p-2 rounded-lg border ${
                    currentFilteredPage === 1
                      ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {[...Array(filteredTotalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show first page, last page, current page, and pages around current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === filteredTotalPages ||
                    (pageNumber >= currentFilteredPage - 1 && pageNumber <= currentFilteredPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageClick(pageNumber)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                          currentFilteredPage === pageNumber
                            ? 'bg-green-500 text-white border-green-500'
                            : 'text-gray-700 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentFilteredPage - 2 ||
                    pageNumber === currentFilteredPage + 2
                  ) {
                    return (
                      <span key={pageNumber} className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={handleNextPage}
                  disabled={currentFilteredPage === filteredTotalPages}
                  className={`p-2 rounded-lg border ${
                    currentFilteredPage === filteredTotalPages
                      ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}