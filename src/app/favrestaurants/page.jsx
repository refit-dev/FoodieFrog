'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Star, Clock, DollarSign, Heart, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const RESTAURANTS_PER_PAGE = 9;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchFavorites();
    }
  }, [status, router]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/favorites');
      const data = await response.json();

      if (data.success) {
        setFavoriteRestaurants(data.data);
      } else {
        console.error('Failed to fetch favorites:', data.message);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (restaurantId) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantId }),
      });

      const data = await response.json();
      
      if (data.success) {
        setFavoriteRestaurants(prev => prev.filter(fav => fav.restaurantId !== restaurantId));
      } else {
        console.error('Failed to remove favorite:', data.message);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const cuisines = [...new Set(favoriteRestaurants.map(fav => fav.cuisineType))];

  const filteredFavorites = favoriteRestaurants.filter(favorite => {
    const matchesSearch = favorite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      favorite.cuisineType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = !selectedCuisine || favorite.cuisineType === selectedCuisine;

    return matchesSearch && matchesCuisine;
  });

  // Calculate pagination for filtered results
  const filteredTotalPages = Math.ceil(filteredFavorites.length / RESTAURANTS_PER_PAGE);
  const currentFilteredPage = Math.min(currentPage, filteredTotalPages || 1);

  // Get current restaurants to display
  const indexOfLastRestaurant = currentFilteredPage * RESTAURANTS_PER_PAGE;
  const indexOfFirstRestaurant = indexOfLastRestaurant - RESTAURANTS_PER_PAGE;
  const currentFavorites = filteredFavorites.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCuisine]);

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

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Favorite Restaurants</h1>
            <p className="text-gray-600 dark:text-gray-400">Your go-to places for delicious food</p>
          </div>
          <Link
            href="/restaurants"
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Discover More
          </Link>
        </div>

        {/* Search and Filter */}
        {favoriteRestaurants.length > 0 && (
          <div className="bg-white dark:bg-[#171717] rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your favorite restaurants..."
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
        )}

        {/* Results Count */}
        {favoriteRestaurants.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {currentFavorites.length} of {filteredFavorites.length} favorite restaurants
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Page {currentFilteredPage} of {filteredTotalPages || 1}
            </p>
          </div>
        )}

        {/* Favorites Grid */}
        {favoriteRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">No favorite restaurants yet</h3>
            <p className="text-gray-600 mb-6">Start by adding some restaurants to your favorites!</p>
            <Link
              href="/restaurants"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Heart className="h-5 w-5 mr-2" />
              Browse Restaurants
            </Link>
          </div>
        ) : currentFavorites.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">No matching favorites</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentFavorites.map(favorite => (
                <div key={favorite._id} className="bg-white dark:bg-[#171717] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden relative">
                  {/* Remove Favorite Button */}
                  <button
                    onClick={() => removeFavorite(favorite.restaurantId)}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <Link href={`/restaurants/${favorite.restaurantId}`}>
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-[#171717]">
                      <img
                        src={favorite.image || '/restaurant-placeholder.jpg'}
                        alt={favorite.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>

                    <div className="p-4 dark:bg-[#171717]">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-200 truncate">
                          {favorite.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1">{favorite.rating || 'New'}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">{favorite.cuisineType}</p>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{favorite.deliveryTime}</span>
                        </div>

                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>Delivery: ${favorite.deliveryFee || '0.00'}</span>
                        </div>
                      </div>

                      {favorite.minimumOrder > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          Min. order: ${favorite.minimumOrder}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
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