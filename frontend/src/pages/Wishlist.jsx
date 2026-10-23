import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaHeart,
  FaShoppingBag,
  FaArrowRight,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext.jsx";

const Wishlist = () => {
  const { user } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);

  // ==========================================
  // GET USER ID
  // ==========================================
  const getUserId = () => {
    if (!user) return null;

    if (user._id) return user._id;
    if (user.id) return user.id;
    if (user.email) return user.email.toLowerCase();

    return null;
  };

  // ==========================================
  // GET USER-SPECIFIC WISHLIST KEY
  // ==========================================
  const getWishlistKey = () => {
    const userId = getUserId();

    if (!userId) return null;

    return `wishlist_${userId}`;
  };

  // ==========================================
  // LOAD WISHLIST
  // ==========================================
  const loadWishlist = () => {
    try {
      if (!user) {
        setWishlistItems([]);
        return;
      }

      // Admin doesn't use customer wishlist
      if (
        user.role === "admin" ||
        user.role === "super_admin"
      ) {
        setWishlistItems([]);
        return;
      }

      const wishlistKey = getWishlistKey();

      if (!wishlistKey) {
        setWishlistItems([]);
        return;
      }

      const savedWishlist = JSON.parse(
        localStorage.getItem(wishlistKey) || "[]"
      );

      setWishlistItems(
        Array.isArray(savedWishlist)
          ? savedWishlist
          : []
      );

    } catch (error) {
      console.error("Wishlist load error:", error);
      setWishlistItems([]);
    }
  };

  // ==========================================
  // LOAD WHEN USER CHANGES
  // ==========================================
  useEffect(() => {
    loadWishlist();
  }, [user]);

  // ==========================================
  // LISTEN FOR WISHLIST UPDATES
  // ==========================================
  useEffect(() => {
    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener(
      "wishlistUpdated",
      handleWishlistUpdate
    );

    window.addEventListener(
      "storage",
      handleWishlistUpdate
    );

    return () => {
      window.removeEventListener(
        "wishlistUpdated",
        handleWishlistUpdate
      );

      window.removeEventListener(
        "storage",
        handleWishlistUpdate
      );
    };
  }, [user]);

  // ==========================================
  // REMOVE FROM WISHLIST
  // ==========================================
  const removeFromWishlist = (id) => {
    try {
      const wishlistKey = getWishlistKey();

      if (!wishlistKey) return;

      const updatedWishlist = wishlistItems.filter(
        (product) => String(product.id) !== String(id)
      );

      setWishlistItems(updatedWishlist);

      localStorage.setItem(
        wishlistKey,
        JSON.stringify(updatedWishlist)
      );

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );

    } catch (error) {
      console.error(
        "Remove wishlist error:",
        error
      );
    }
  };

  // ==========================================
  // NOT LOGGED IN
  // ==========================================
  if (!user) {
    return (
      <div className="min-h-screen bg-[#fcf8f5] text-[#1e2b2b]">

        <section className="bg-[#1e2b2b] text-white py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">

            <p className="text-[#d4b68a] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
              Your favourites
            </p>

            <h1 className="text-4xl md:text-5xl font-light">
              My{" "}
              <span className="font-semibold text-[#d4b68a]">
                Wishlist
              </span>
            </h1>

            <p className="text-white/60 mt-4 max-w-xl">
              Keep the skincare products you love in one beautiful place.
            </p>

          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">

          <div className="min-h-[400px] flex items-center justify-center">

            <div className="text-center max-w-md">

              <div className="w-24 h-24 mx-auto rounded-full bg-[#f3ede8] flex items-center justify-center mb-7">
                <FaHeart className="text-4xl text-[#b48b6a]" />
              </div>

              <h2 className="text-3xl font-light">
                Login to View Your Wishlist
              </h2>

              <p className="text-gray-500 mt-3 leading-relaxed">
                Please login to save and view your favourite skincare products.
              </p>

              <Link
                to="/login"
                className="inline-flex items-center gap-3 mt-8 bg-[#1e2b2b] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#b48b6a] transition-all duration-300"
              >
                <FaUserIcon />
                Login
                <FaArrowRight className="text-sm" />
              </Link>

            </div>

          </div>

        </section>

      </div>
    );
  }

  // ==========================================
  // ADMIN WISHLIST
  // ==========================================
  if (
    user.role === "admin" ||
    user.role === "super_admin"
  ) {
    return (
      <div className="min-h-screen bg-[#fcf8f5] text-[#1e2b2b]">

        <section className="bg-[#1e2b2b] text-white py-16">

          <div className="max-w-7xl mx-auto px-6 lg:px-10">

            <p className="text-[#d4b68a] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
              Administration
            </p>

            <h1 className="text-4xl md:text-5xl font-light">
              Customer{" "}
              <span className="font-semibold text-[#d4b68a]">
                Wishlist
              </span>
            </h1>

          </div>

        </section>

        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">

          <div className="min-h-[400px] flex items-center justify-center">

            <div className="text-center max-w-md">

              <div className="w-24 h-24 mx-auto rounded-full bg-[#f3ede8] flex items-center justify-center mb-7">
                <FaHeart className="text-4xl text-[#b48b6a]" />
              </div>

              <h2 className="text-3xl font-light">
                Wishlist Not Available
              </h2>

              <p className="text-gray-500 mt-3 leading-relaxed">
                Admin accounts do not have a customer wishlist.
              </p>

              <Link
                to="/admin"
                className="inline-flex items-center gap-3 mt-8 bg-[#1e2b2b] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#b48b6a] transition-all duration-300"
              >
                Admin Dashboard
                <FaArrowRight className="text-sm" />
              </Link>

            </div>

          </div>

        </section>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf8f5] text-[#1e2b2b]">

      {/* ================= HEADER ================= */}
      <section className="bg-[#1e2b2b] text-white py-16">

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <p className="text-[#d4b68a] text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            Your favourites
          </p>

          <h1 className="text-4xl md:text-5xl font-light">
            My{" "}
            <span className="font-semibold text-[#d4b68a]">
              Wishlist
            </span>
          </h1>

          <p className="text-white/60 mt-4 max-w-xl">
            Keep the skincare products you love in one beautiful place.
          </p>

        </div>

      </section>

      {/* ================= CONTENT ================= */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">

        {wishlistItems.length === 0 ? (

          /* ================= EMPTY WISHLIST ================= */
          <div className="min-h-[400px] flex items-center justify-center">

            <div className="text-center max-w-md">

              <div className="w-24 h-24 mx-auto rounded-full bg-[#f3ede8] flex items-center justify-center mb-7">
                <FaHeart className="text-4xl text-[#b48b6a]" />
              </div>

              <h2 className="text-3xl font-light">
                Your Wishlist is Empty
              </h2>

              <p className="text-gray-500 mt-3 leading-relaxed">
                You haven't saved any products yet.
                Explore our collection and add your favourites here.
              </p>

              <Link
                to="/shop"
                className="inline-flex items-center gap-3 mt-8 bg-[#1e2b2b] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#b48b6a] transition-all duration-300"
              >
                <FaShoppingBag />
                Start Shopping
                <FaArrowRight className="text-sm" />
              </Link>

            </div>

          </div>

        ) : (

          /* ================= PRODUCTS ================= */
          <>

            {/* TOP */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">

              <div>

                <p className="text-[#b48b6a] text-xs tracking-[0.25em] uppercase font-semibold">
                  Saved for later
                </p>

                <h2 className="text-3xl font-light mt-2">
                  Your Favourite Products
                </h2>

                <p className="text-gray-500 text-sm mt-2">
                  {wishlistItems.length}{" "}
                  {wishlistItems.length === 1
                    ? "product"
                    : "products"}{" "}
                  saved
                </p>

              </div>

              <Link
                to="/shop"
                className="flex items-center gap-2 text-[#b48b6a] font-semibold hover:gap-3 transition-all"
              >
                Continue Shopping
                <FaArrowRight className="text-sm" />
              </Link>

            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">

              {wishlistItems.map((product) => (

                <div
                  key={product.id}
                  className="group bg-white rounded-[30px] overflow-hidden border border-[#eee5df] hover:shadow-xl transition-all duration-500"
                >

                  {/* IMAGE */}
                  <div className="relative h-[320px] bg-[#f3ede8] overflow-hidden">

                    <img
                      src={
                        product.image ||
                        product.images?.[0] ||
                        "https://via.placeholder.com/700x700/f3ede8/1e2b2b?text=Lumiere+Skincare"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/700x700/f3ede8/1e2b2b?text=Lumiere+Skincare";
                      }}
                    />

                    {/* SAVED BADGE */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">

                      <span className="text-[10px] font-bold tracking-wider text-[#1e2b2b]">
                        SAVED
                      </span>

                    </div>

                    {/* REMOVE BUTTON */}
                    <button
                      onClick={() =>
                        removeFromWishlist(product.id)
                      }
                      className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/95 flex items-center justify-center shadow-md hover:bg-[#1e2b2b] transition-all duration-300 group/heart"
                      title="Remove from wishlist"
                    >
                      <FaHeart className="text-[#b48b6a] group-hover/heart:text-white transition" />
                    </button>

                  </div>

                  {/* DETAILS */}
                  <div className="p-6">

                    <p className="text-[#b48b6a] text-xs uppercase tracking-[0.15em] font-semibold">
                      {product.type ||
                        product.category ||
                        "Skincare"}
                    </p>

                    <h3 className="text-xl font-semibold mt-2 text-[#1e2b2b]">
                      {product.name}
                    </h3>

                    {/* RATING */}
                    <div className="flex items-center gap-2 mt-3">

                      <div className="flex gap-1 text-[#d4b068] text-sm">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </div>

                      <span className="text-sm text-gray-500">
                        {product.rating || "4.8"}
                      </span>

                    </div>

                    {/* PRICE */}
                    <div className="flex items-center justify-between mt-6">

                      <span className="text-xl font-semibold">
                        LKR{" "}
                        {Number(
                          product.price || 0
                        ).toLocaleString()}
                      </span>

                      <Link
                        to={`/product/${product.id}`}
                        className="text-[#b48b6a] text-sm font-semibold flex items-center gap-2 hover:text-[#1e2b2b] transition"
                      >
                        View
                        <FaArrowRight className="text-xs" />
                      </Link>

                    </div>

                    {/* VIEW PRODUCT BUTTON */}
                    <Link
                      to={`/product/${product.id}`}
                      className="mt-5 w-full bg-[#1e2b2b] text-white py-3 rounded-full flex items-center justify-center gap-2 font-semibold text-sm hover:bg-[#b48b6a] transition-all duration-300"
                    >
                      <FaShoppingBag className="text-xs" />
                      View Product
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          </>

        )}

      </section>

    </div>
  );
};

// Small icon component for login button
const FaUserIcon = () => (
  <FaHeart className="text-sm" />
);

export default Wishlist;