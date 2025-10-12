'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import Swal from 'sweetalert2';

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isAvailable: true,
    dietaryInfo: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
    },
    preparationTime: 15,
  });

  // Common restaurant categories
  const commonCategories = [
    'Appetizers',
    'Main Course',
    'Pizza',
    'Burgers',
    'Pasta',
    'Salads',
    'Sandwiches',
    'Seafood',
    'Desserts',
    'Beverages',
    'Soups',
    'Sides',
    'Breakfast',
    'Lunch Specials',
    'Dinner Specials',
    'Kids Menu',
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/restaurant/menu');
      const data = await response.json();

      if (data.success) {
        setMenuItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('dietaryInfo.')) {
      const dietaryField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        dietaryInfo: {
          ...prev.dietaryInfo,
          [dietaryField]: checked,
        },
      }));
    } else if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      isAvailable: true,
      dietaryInfo: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isSpicy: false,
      },
      preparationTime: 15,
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingItem
        ? `/api/restaurant/menu/${editingItem._id}`
        : '/api/restaurant/menu';

      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          preparationTime: parseInt(formData.preparationTime),
        }),
      });

      const result = await response.json();

      if (result.success) {
        await Swal.fire({
          title: 'Success!',
          text: editingItem ? 'Menu item updated!' : 'Menu item added!',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#22c55e',
        });

        resetForm();
        fetchMenuItems();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      await Swal.fire({
        title: 'Error!',
        text: error.message || 'Failed to save menu item',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      category: item.category || '',
      image: item.image || '',
      isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      dietaryInfo: item.dietaryInfo || {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isSpicy: false,
      },
      preparationTime: item.preparationTime || 15,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (itemId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/restaurant/menu/${itemId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          await Swal.fire({
            title: 'Deleted!',
            text: 'Menu item has been deleted.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#22c55e',
          });

          fetchMenuItems();
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error deleting menu item:', error);
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to delete menu item',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#ef4444',
        });
      }
    }
  };

  const toggleAvailability = async (itemId, currentStatus) => {
    try {
      const response = await fetch(`/api/restaurant/menu/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isAvailable: !currentStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchMenuItems();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Failed to update availability',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  // Get unique categories from existing menu items and combine with common categories
  const existingCategories = [
    ...new Set(menuItems.map((item) => item.category)),
  ];
  const allCategories = [
    ...new Set([...commonCategories, ...existingCategories]),
  ];

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="mt-8 w-full">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Menu Management
          </h1>
          <p className="text-gray-600 mt-2 text-center">
            Add and manage your restaurant menu items
          </p>
        </div>
      </div>
      <div className="flex justify-center mt-2 mb-12">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Menu Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {allCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="other">Other (specify below)</option>
                </select>

                {formData.category === 'other' && (
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter custom category"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe the menu item"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preparation Time (min)
                </label>
                <input
                  type="number"
                  min="1"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Dietary Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Dietary Information
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="dietaryInfo.isVegetarian"
                    checked={formData.dietaryInfo.isVegetarian}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Vegetarian</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="dietaryInfo.isVegan"
                    checked={formData.dietaryInfo.isVegan}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Vegan</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="dietaryInfo.isGlutenFree"
                    checked={formData.dietaryInfo.isGlutenFree}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Gluten Free
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="dietaryInfo.isSpicy"
                    checked={formData.dietaryInfo.isSpicy}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Spicy</span>
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Available for ordering
              </span>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Items List */}
      <div className="rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {menuItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No menu items yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by adding your first menu item
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col h-full">
                  {item.image && (
                    <div className="mb-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-green-600">
                        ${item.price}
                      </span>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          item.isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
                      <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs">
                        {item.category}
                      </span>
                      <span className="text-xs">•</span>
                      <span className="text-xs">
                        {item.preparationTime} min
                      </span>

                      {item.dietaryInfo && (
                        <div className="flex flex-wrap gap-1">
                          {item.dietaryInfo.isVegetarian && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              Vegetarian
                            </span>
                          )}
                          {item.dietaryInfo.isVegan && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              Vegan
                            </span>
                          )}
                          {item.dietaryInfo.isGlutenFree && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              Gluten Free
                            </span>
                          )}
                          {item.dietaryInfo.isSpicy && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              Spicy
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-auto">
                    <button
                      onClick={() =>
                        toggleAvailability(item._id, item.isAvailable)
                      }
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        item.isAvailable
                          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                      title={
                        item.isAvailable ? 'Mark Unavailable' : 'Mark Available'
                      }
                    >
                      {item.isAvailable ? 'Hide' : 'Show'}
                    </button>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
