'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function AddRestaurantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [existingRestaurant, setExistingRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cuisineType: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    phone: '',
    deliveryTime: '30-45 min',
    deliveryFee: 2.99,
    minimumOrder: 0,
    image: '',
    openingHours: {
      monday: { open: '09:00', close: '22:00' },
      tuesday: { open: '09:00', close: '22:00' },
      wednesday: { open: '09:00', close: '22:00' },
      thursday: { open: '09:00', close: '22:00' },
      friday: { open: '09:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '10:00', close: '21:00' }
    }
  });

  useEffect(() => {
    fetchExistingRestaurant();
  }, []);

  const fetchExistingRestaurant = async () => {
    try {
      const response = await fetch('/api/restaurant/my-restaurant');
      const data = await response.json();
      
      if (data.success && data.data) {
        setExistingRestaurant(data.data);
        setFormData({
          name: data.data.name || '',
          description: data.data.description || '',
          cuisineType: data.data.cuisineType || '',
          address: data.data.address || {
            street: '', city: '', state: '', zipCode: '', country: ''
          },
          phone: data.data.phone || '',
          deliveryTime: data.data.deliveryTime || '30-45 min',
          deliveryFee: data.data.deliveryFee || 2.99,
          minimumOrder: data.data.minimumOrder || 0,
          image: data.data.image || '',
          openingHours: data.data.openingHours || {
            monday: { open: '09:00', close: '22:00' },
            tuesday: { open: '09:00', close: '22:00' },
            wednesday: { open: '09:00', close: '22:00' },
            thursday: { open: '09:00', close: '22:00' },
            friday: { open: '09:00', close: '23:00' },
            saturday: { open: '10:00', close: '23:00' },
            sunday: { open: '10:00', close: '21:00' }
          }
        });
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // ✅ Upload new image - Same logic as restaurant register page
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      Swal.fire('Error', 'Please upload a valid image file (JPEG, PNG, WEBP)', 'error');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire('Error', 'Image size should be less than 5MB', 'error');
      return;
    }

    setUploadingImage(true);

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      
      if (data.url) {
        setFormData(prev => ({ ...prev, image: data.url }));
        Swal.fire("Success", "Image uploaded successfully!", "success");
      } else {
        Swal.fire("Error", "Failed to upload image", "error");
      }
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire("Error", "Upload error", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  // ✅ Remove uploaded image
  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ''
    }));
    Swal.fire("Removed", "Image removed successfully!", "info");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!formData.name || !formData.cuisineType || !formData.address.street || !formData.phone) {
      Swal.fire({
        title: 'Missing Information!',
        text: 'Please fill in all required fields',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      setLoading(false);
      return;
    }

    try {
      const url = existingRestaurant 
        ? `/api/restaurant/my-restaurant` 
        : '/api/restaurant/add';
      
      const method = existingRestaurant ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        await Swal.fire({
          title: 'Success!',
          text: existingRestaurant 
            ? 'Restaurant updated successfully!' 
            : 'Restaurant added successfully!',
          icon: 'success',
          confirmButtonText: 'Continue',
          confirmButtonColor: '#22c55e',
        });

        router.push('/restaurant/dashboard');
      } else {
        await Swal.fire({
          title: 'Error!',
          text: result.message || 'Operation failed',
          icon: 'error',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#ef4444',
        });
      }
    } catch (error) {
      console.error('Error saving restaurant:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'An unexpected error occurred',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {existingRestaurant ? 'Edit Your Restaurant' : 'Add Your Restaurant'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {existingRestaurant 
              ? 'Update your restaurant information' 
              : 'Complete your restaurant profile to start receiving orders'
            }
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Restaurant Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Enter restaurant name"
                />
              </div>

              <div>
                <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700">
                  Cuisine Type *
                </label>
                <select
                  id="cuisineType"
                  name="cuisineType"
                  required
                  value={formData.cuisineType}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                  <option value="">Select Cuisine</option>
                  <option value="Italian">Italian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="American">American</option>
                  <option value="Thai">Thai</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Fast Food">Fast Food</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Barbecue">Barbecue</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Describe your restaurant and specialties"
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Image
              </label>
              
              {formData.image ? (
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={formData.image} 
                      alt="Restaurant preview" 
                      className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">Image uploaded successfully!</p>
                    <p className="text-xs text-gray-500">Click the X to remove</p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
                      <p className="text-sm text-gray-600">Uploading image...</p>
                      <p className="text-xs text-gray-500">Please wait</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="text-green-600 font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mb-4">PNG, JPG, WEBP up to 5MB</p>
                      
                      <label className="cursor-pointer bg-green-600 text-white py-2 px-4 rounded-lg inline-block hover:bg-green-700 transition-colors text-sm font-medium">
                        Choose Restaurant Image
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
              
              <div>
                <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                  Street Address *
                </label>
                <input
                  id="address.street"
                  name="address.street"
                  type="text"
                  required
                  value={formData.address.street}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                    City *
                  </label>
                  <input
                    id="address.city"
                    name="address.city"
                    type="text"
                    required
                    value={formData.address.city}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                    State *
                  </label>
                  <input
                    id="address.state"
                    name="address.state"
                    type="text"
                    required
                    value={formData.address.state}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="State"
                  />
                </div>

                <div>
                  <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">
                    ZIP Code *
                  </label>
                  <input
                    id="address.zipCode"
                    name="address.zipCode"
                    type="text"
                    required
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="ZIP Code"
                  />
                </div>

                <div>
                  <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                    Country *
                  </label>
                  <input
                    id="address.country"
                    name="address.country"
                    type="text"
                    required
                    value={formData.address.country}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            {/* Contact & Delivery Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label htmlFor="deliveryTime" className="block text-sm font-medium text-gray-700">
                  Delivery Time
                </label>
                <select
                  id="deliveryTime"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                  <option value="15-25 min">15-25 min</option>
                  <option value="20-30 min">20-30 min</option>
                  <option value="25-35 min">25-35 min</option>
                  <option value="30-45 min">30-45 min</option>
                  <option value="45-60 min">45-60 min</option>
                </select>
              </div>

              <div>
                <label htmlFor="deliveryFee" className="block text-sm font-medium text-gray-700">
                  Delivery Fee ($)
                </label>
                <input
                  id="deliveryFee"
                  name="deliveryFee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.deliveryFee}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="minimumOrder" className="block text-sm font-medium text-gray-700">
                  Minimum Order ($)
                </label>
                <input
                  id="minimumOrder"
                  name="minimumOrder"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.minimumOrder}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t">
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {existingRestaurant ? 'Updating...' : 'Adding...'}
                  </span>
                ) : (
                  existingRestaurant ? 'Update Restaurant' : 'Add Restaurant'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}