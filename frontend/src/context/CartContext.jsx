import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Create Context
const CartContext = createContext();

// Custom Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// Provider Component
export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api/cart';

  // Fetch cart from server
  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response?.status === 401) {
        setCart({ items: [] });
      }
    } finally {
      setLoading(false);
    }
  };

  // Load cart when user changes
  useEffect(() => {
    fetchCart();
  }, [user]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return false;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        API_URL,
        { userId: user.id, productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data.cart);
      toast.success('Added to cart! 🛒');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await axios.delete(`${API_URL}/${user.id}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data.cart);
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove from cart');
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    if (!user) return;
    
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        API_URL,
        { userId: user.id, productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data.cart);
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart({ items: [] });
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  // Get total items count
  const getTotalItems = () => {
    return cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  // Get subtotal
  const getSubtotal = () => {
    return cart?.items?.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity, 
      0
    ) || 0;
  };

  // Context value
  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCart,
    totalItems: getTotalItems(),
    subtotal: getSubtotal(),
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};