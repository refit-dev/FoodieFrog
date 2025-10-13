'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, Clock, DollarSign, MapPin, Phone, User, Send } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

export default function RestaurantPage() {
  const params = useParams();
  const restaurantId = params.id;
  const { data: session } = useSession();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const { addItem, restaurant: cartRestaurant } = useCart();

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    title: ''
  });

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

        // Fetch reviews for this restaurant
        const reviewsResponse = await fetch(`/api/restaurants/${restaurantId}/reviews`);
        const reviewsData = await reviewsResponse.json();

        if (reviewsData.success) {
          setReviews(reviewsData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!session) {
      Swal.fire({
        title: 'Sign In Required',
        text: 'Please sign in to submit a review',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    setReviewLoading(true);

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          title: reviewForm.title
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh reviews and restaurant data
        const reviewsResponse = await fetch(`/api/restaurants/${restaurantId}/reviews`);
        const reviewsData = await reviewsResponse.json();

        if (reviewsData.success) {
          setReviews(reviewsData.data);
        }

        // Refresh restaurant data to get updated rating
        const restaurantResponse = await fetch(`/api/restaurants/${restaurantId}`);
        const restaurantData = await restaurantResponse.json();
        if (restaurantData.success) {
          setRestaurant(restaurantData.data);
        }

        // Reset form
        setReviewForm({
          rating: 5,
          comment: '',
          title: ''
        });
        setShowReviewForm(false);

        // Show success message with SweetAlert
        await Swal.fire({
          title: 'Success!',
          text: 'Your review has been submitted successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#22c55e',
        });
      } else {
        await Swal.fire({
          title: 'Error!',
          text: result.message || 'Failed to submit review',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ef4444',
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'An error occurred while submitting your review',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setReviewLoading(false);
    }
  };

  const handleRatingChange = (rating) => {
    setReviewForm(prev => ({ ...prev, rating }));
  };

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Get unique categories from menu items
  const categories = ['all', ...new Set(menuItems.map(item => item.category))];

  // Filter menu items by category
  const filteredMenuItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen dark:bg-black bg-gray-50 py-8">
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
    <div className="min-h-screen pt-16 dark:bg-black bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white dark:bg-[#171717] shadow-sm">
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
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-2">{restaurant.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="ml-1 text-gray-700 dark:text-gray-400 font-medium">
                    {averageRating || 'New'} ({reviews.length} reviews)
                  </span>
                </div>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-gray-600 dark:text-gray-400 capitalize">{restaurant.cuisineType}</span>
              </div>

              <p className="text-gray-700 dark:text-gray-400 mb-6">{restaurant.description}</p>

              {/* Restaurant Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{restaurant.deliveryTime}</span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <DollarSign className="h-5 w-5 mr-2" />
                  <span>Delivery: ${restaurant.deliveryFee || '0.00'}</span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{restaurant.address?.street}, {restaurant.address?.city}</span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>{restaurant.phone}</span>
                </div>
              </div>

              {restaurant.minimumOrder > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-yellow-800 text-sm">
                    Minimum order: ${restaurant.minimumOrder}
                  </p>
                </div>
              )}

              {/* Add Review Button */}
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                {showReviewForm ? 'Cancel Review' : 'Write a Review'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white dark:bg-[#171717] rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-4">
              Write a Review {session?.user?.name && `- ${session.user.name}`}
            </h3>
            
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Rating Stars */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="text-2xl focus:outline-none"
                    >
                      {star <= reviewForm.rating ? (
                        <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="h-8 w-8 text-gray-300" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {reviewForm.rating} out of 5 stars
                </p>
              </div>

              {/* Review Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Review Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Summarize your experience"
                  maxLength={100}
                />
              </div>

              {/* Review Comment */}
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Review
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Share details of your experience at this restaurant"
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {reviewForm.comment.length}/500 characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={reviewLoading || !reviewForm.comment.trim()}
                  className="flex items-center bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reviewLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4">Menu</h2>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-[#171717] text-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
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
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">No menu items found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {activeCategory === 'all'
                  ? 'This restaurant has no menu items yet.'
                  : `No ${activeCategory} items available.`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map(item => (
                <div key={item._id} className="bg-white dark:bg-[#171717] rounded-lg shadow-sm border dark:border-gray-500 border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img
                      src={item.image || '/food-placeholder.jpg'}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-200">{item.name}</h3>
                      <span className="text-green-600 font-bold">${item.price}</span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>

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
                <div className="col-span-full">
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
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section - Moved to Bottom */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-[#171717] rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-6">Customer Reviews</h2>

          {/* Average Rating */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold text-gray-900 dark:text-gray-200 mb-2">
              {averageRating}
            </div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${star <= averageRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Be the first to share your experience with this restaurant!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 dark:border-gray-600 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-200">
                          {review.userName || 'Anonymous User'}
                        </h4>
                        <div className="flex items-center">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {review.title && (
                    <h5 className="font-semibold text-gray-900 dark:text-gray-200 mb-2">
                      {review.title}
                    </h5>
                  )}

                  <p className="text-gray-700 dark:text-gray-400">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}