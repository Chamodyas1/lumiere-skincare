
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaHeart,
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaExchangeAlt,
} from 'react-icons/fa';

import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdmin =
    user?.role === 'admin' || user?.role === 'super_admin';

  // GET USER ID
  const getUserId = () => {
    if (!user) return null;

    if (user._id) return user._id;
    if (user.id) return user.id;
    if (user.email) return user.email.toLowerCase();

    return null;
  };

  // GET USER-SPECIFIC CART KEY
  const getCartKey = () => {
    const userId = getUserId();

    if (!userId) return null;

    return `cart_${userId}`;
  };

  // UPDATE CART COUNT
  useEffect(() => {
    const updateCartCount = () => {
      try {
        if (!user || isAdmin) {
          setCartCount(0);
          return;
        }

        const cartKey = getCartKey();

        if (!cartKey) {
          setCartCount(0);
          return;
        }

        const cart = JSON.parse(
          localStorage.getItem(cartKey) || '[]'
        );

        const totalItems = cart.reduce(
          (total, item) =>
            total + Number(item.quantity || 0),
          0
        );

        setCartCount(totalItems);
      } catch (error) {
        console.error('Cart count error:', error);
        setCartCount(0);
      }
    };

    updateCartCount();

    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, [user, isAdmin]);

  // CLOSE MOBILE MENU
  const closeMenu = () => {
    setIsOpen(false);
  };

  // LOGOUT
  const handleLogout = () => {
    logout();
    setCartCount(0);
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm">

      {/* TOP BAR */}
      <div className="bg-[#1e2b2b] text-white text-sm py-2">
        <div className="container-custom flex justify-between">
          <span>🚚 Free Shipping on orders over $50</span>

          <span>
            🎁 Get 10% off -
            <span className="bg-[#d4b68a] text-[#1e2b2b] px-2 rounded ml-1">
              GLOW10
            </span>
          </span>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="container-custom py-4">
        <div className="flex justify-between items-center">

          {/* LOGO */}
          <Link
            to="/"
            onClick={closeMenu}
            className="text-2xl font-light tracking-widest"
          >
            LUMIÈRE{' '}
            <span className="font-semibold text-[#b48b6a]">
              SKINCARE
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-6">

            <Link
              to="/"
              className="hover:text-[#b48b6a] transition"
            >
              Home
            </Link>

            <Link
              to="/shop"
              className="hover:text-[#b48b6a] transition"
            >
              Shop
            </Link>

            <Link
              to="/wishlist"
              className="hover:text-[#b48b6a] transition"
            >
              Wishlist
            </Link>

            <Link
              to="/orders"
              className="hover:text-[#b48b6a] transition"
            >
              Orders
            </Link>

            {/* COMPARE PRODUCTS */}
            <Link
              to="/compare"
              className="flex items-center gap-2 hover:text-[#b48b6a] transition"
            >
              <FaExchangeAlt />
              Compare Products
            </Link>

            {/* ADMIN */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 text-[#b48b6a] font-semibold hover:text-[#1e2b2b] transition"
              >
                <FaTachometerAlt />
                Admin
              </Link>
            )}
          </div>

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center gap-4">

            {/* SEARCH */}
            <button
              type="button"
              onClick={() => navigate('/shop')}
              aria-label="Search products"
              className="text-xl hover:text-[#b48b6a] transition"
            >
              <FaSearch />
            </button>

            {/* USER LOGIN / MY ACCOUNT / LOGOUT */}
            {!user ? (
              <Link to="/login" aria-label="Login">
                <FaUser className="text-xl hover:text-[#b48b6a] transition" />
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate(isAdmin ? '/admin' : '/my-account')
                  }
                  aria-label={
                    isAdmin ? 'Admin Dashboard' : 'My Account'
                  }
                  title={
                    isAdmin ? 'Admin Dashboard' : 'My Account'
                  }
                  className="text-xl hover:text-[#b48b6a] transition"
                >
                  <FaUser className="text-[#b48b6a]" />
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium text-[#b48b6a] hover:text-[#1e2b2b] transition"
                >
                  Logout
                </button>
              </div>
            )}

            {/* WISHLIST ICON */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
            >
              <FaHeart className="text-xl hover:text-[#b48b6a] transition" />
            </Link>

            {/* SHOPPING CART */}
            <Link
              to="/cart"
              className="relative"
              aria-label="Shopping cart"
            >
              <FaShoppingBag className="text-xl hover:text-[#b48b6a] transition" />

              {!isAdmin && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#b48b6a] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* MOBILE MENU BUTTON */}
            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
              className="md:hidden text-2xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>

          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-4 pb-4">

            <Link to="/" onClick={closeMenu}>
              Home
            </Link>

            <Link to="/shop" onClick={closeMenu}>
              Shop
            </Link>

            <Link to="/wishlist" onClick={closeMenu}>
              Wishlist
            </Link>

            <Link to="/orders" onClick={closeMenu}>
              Orders
            </Link>

            {/* COMPARE PRODUCTS */}
            <Link
              to="/compare"
              onClick={closeMenu}
              className="flex items-center gap-2 text-[#b48b6a] font-semibold hover:text-[#1e2b2b] transition"
            >
              <FaExchangeAlt />
              Compare Products
            </Link>

            {/* ADMIN */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className="flex items-center gap-2 text-[#b48b6a] font-semibold"
              >
                <FaTachometerAlt />
                Admin Dashboard
              </Link>
            )}

            {/* MOBILE LOGIN / LOGOUT */}
            {!user ? (
              <Link
                to="/login"
                onClick={closeMenu}
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Logged in
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[#b48b6a] font-medium"
                >
                  Logout
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
