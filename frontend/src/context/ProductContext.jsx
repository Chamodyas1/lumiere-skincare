import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create Context
const ProductContext = createContext();

// Custom Hook
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};

// Provider Component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
  });

  const API_URL = 'http://localhost:5000/api/products';

  // Get all products
  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(API_URL, { params });
      setProducts(response.data.products);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to load products';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get single product by ID
  const fetchProductById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.product;
    } catch (error) {
      const message = error.response?.data?.message || 'Product not found';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get best sellers
  const fetchBestSellers = async (limit = 4) => {
    try {
      setLoading(true);
      
      const response = await axios.get(API_URL, {
        params: { bestSeller: true, limit }
      });
      return response.data.products;
    } catch (error) {
      toast.error('Failed to load best sellers');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get new arrivals
  const fetchNewArrivals = async (limit = 4) => {
    try {
      setLoading(true);
      
      const response = await axios.get(API_URL, {
        params: { newArrival: true, limit }
      });
      return response.data.products;
    } catch (error) {
      toast.error('Failed to load new arrivals');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get products by category
  const fetchByCategory = async (category) => {
    try {
      setLoading(true);
      
      const response = await axios.get(API_URL, {
        params: { category }
      });
      setProducts(response.data.products);
      return response.data.products;
    } catch (error) {
      toast.error(`Failed to load ${category} products`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Search products
  const searchProducts = async (searchTerm) => {
    try {
      setLoading(true);
      
      const response = await axios.get(API_URL, {
        params: { search: searchTerm }
      });
      setProducts(response.data.products);
      return response.data.products;
    } catch (error) {
      toast.error('Search failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = async (newFilters) => {
    const mergedFilters = { ...filters, ...newFilters };
    setFilters(mergedFilters);
    
    // Remove empty values
    const params = {};
    Object.keys(mergedFilters).forEach(key => {
      if (mergedFilters[key] && mergedFilters[key] !== '') {
        params[key] = mergedFilters[key];
      }
    });
    
    await fetchProducts(params);
  };

  // Clear filters
  const clearFilters = async () => {
    const cleared = {
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
    };
    setFilters(cleared);
    await fetchProducts();
  };

  // Context value
  const value = {
    products,
    loading,
    error,
    filters,
    fetchProducts,
    fetchProductById,
    fetchBestSellers,
    fetchNewArrivals,
    fetchByCategory,
    searchProducts,
    applyFilters,
    clearFilters,
    setFilters,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};