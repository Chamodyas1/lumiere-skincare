
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FaStar,
  FaFilter,
  FaTimes,
  FaHeart,
  FaShoppingBag,
  FaSearch,
  FaSlidersH,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

const Shop = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [search, setSearch] = useState("");

  // =====================================
  // USER-SPECIFIC WISHLIST KEY
  // =====================================

  const getWishlistKey = () => {
    if (!user) return null;

    const userId = user._id || user.id || user.email?.toLowerCase();

    return userId ? `wishlist_${userId}` : null;
  };

  // =====================================
  // LOAD PRODUCTS ADDED BY ADMIN
  // =====================================

  // =====================================
// LOAD PRODUCTS FROM MONGODB
// =====================================

useEffect(() => {
  const loadProducts = async () => {
    try {
      // Load products saved in MongoDB
      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      const data = response.data;

      const mongoProducts = Array.isArray(data)
        ? data
        : Array.isArray(data.products)
        ? data.products
        : Array.isArray(data.data)
        ? data.data
        : [];

      // Also load products saved in localStorage
      const savedProducts = JSON.parse(
        localStorage.getItem("products") || "[]"
      );

      const localProducts = Array.isArray(savedProducts)
        ? savedProducts
        : [];

      // Combine both sources without duplicating MongoDB products
      const combinedProducts = [
        ...mongoProducts,
        ...localProducts.filter(
          (localProduct) =>
            !mongoProducts.some(
              (mongoProduct) =>
                String(mongoProduct._id) ===
                  String(localProduct._id) ||
                (
                  localProduct._id &&
                  mongoProduct._id &&
                  String(mongoProduct._id) ===
                    String(localProduct._id)
                )
            )
        ),
      ];

      setProducts(combinedProducts);
    } catch (error) {
      console.error("Error loading MongoDB products:", error);

      // Fallback to localStorage if API request fails
      try {
        const savedProducts = JSON.parse(
          localStorage.getItem("products") || "[]"
        );

        setProducts(
          Array.isArray(savedProducts) ? savedProducts : []
        );
      } catch {
        setProducts([]);
      }
    }
  };

  loadProducts();

  window.addEventListener("productsUpdated", loadProducts);

  return () => {
    window.removeEventListener("productsUpdated", loadProducts);
  };
}, []);

  // =====================================
  // CHECK WHETHER PRODUCT IS WISHLISTED
  // =====================================

  const isInWishlist = (product) => {
    const productId = String(product._id || product.id);

    return wishlist.some(
      (item) => String(item._id || item.id) === productId
    );
  };

  // =====================================
  // ADD / REMOVE WISHLIST
  // =====================================

  const toggleWishlist = (product) => {
    if (!user) {
      toast.error("Please login to use your wishlist");
      return;
    }

    if (["admin", "super_admin"].includes(user.role)) {
      toast.error("Wishlist is available for customer accounts");
      return;
    }

    const key = getWishlistKey();

    if (!key) {
      toast.error("Unable to identify your account");
      return;
    }

    const productId = String(product._id || product.id);

    const exists = wishlist.some(
      (item) => String(item._id || item.id) === productId
    );

    const updatedWishlist = exists
      ? wishlist.filter(
          (item) => String(item._id || item.id) !== productId
        )
      : [...wishlist, product];

    try {
      localStorage.setItem(key, JSON.stringify(updatedWishlist));

      setWishlist(updatedWishlist);
      window.dispatchEvent(new Event("wishlistUpdated"));

      toast.success(
        exists ? "Removed from wishlist" : "Added to wishlist ❤️"
      );
    } catch (error) {
      console.error("Wishlist save error:", error);
      toast.error("Could not update wishlist");
    }
  };

  // =====================================
  // CATEGORY OPTIONS
  // =====================================

  const categories = [
    "Cleansers",
    "Moisturizers",
    "Serums",
    "Sunscreen",
    "Masks",
    "Beauty Tools",
  ];

  // =====================================
  // FILTER PRODUCTS
  // =====================================
      
  // ============================
  // FILTER PRODUCTS
  // ============================

  const normalizeCategory = (category) => {
    const value = String(category || "")
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, "-");

    const aliases = {
      cleansers: "cleanser",
      moisturizers: "moisturizer",
      serums: "serum",
      sunscreens: "sunscreen",
      masks: "mask",
      "beauty-tools": "beauty-tools",
    };

    return aliases[value] || value;
  };
  
  // APPLY FILTER
  const applyFilters = () => {
    if (selectedCategory) {
      setSearchParams({
        category: selectedCategory,
      });
    } else {
      setSearchParams({});
    }

    setShowFilters(false);
  };

  // CLEAR FILTER
  const clearFilters = () => {
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSearch("");

    setSearchParams({});
    setShowFilters(false);
  };


  useEffect(() => {
    let result = [...products];

    const categoryFromURL = searchParams.get("category") || "";
    const categoryToFilter = selectedCategory || categoryFromURL;

    if (categoryToFilter) {
      result = result.filter(
        (product) =>
          normalizeCategory(product.category) ===
          normalizeCategory(categoryToFilter)
      );
    }

    if (minPrice !== "") {
      result = result.filter(
        (product) => Number(product.price) >= Number(minPrice)
      );
    }

    if (maxPrice !== "") {
      result = result.filter(
        (product) => Number(product.price) <= Number(maxPrice)
      );
    }

    if (search.trim() !== "") {
      result = result.filter((product) =>
        product.name
          ?.toLowerCase()
          .includes(search.trim().toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [
    products,
    searchParams,
    selectedCategory,
    minPrice,
    maxPrice,
    search,
  ]);

   // =====================================
  // PRODUCT IMAGE
  // =====================================

  const getProductImage = (product) => {
    if (product.image) return product.image;

    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }

    return "";
  };

  // =====================================
  // PRICE FORMAT
  // =====================================

  const formatPrice = (price) =>
    `LKR ${Number(price || 0).toLocaleString("en-LK")}`;

  // =====================================
  // PAGE
  // =====================================

  return (
    <div className="min-h-screen bg-[#fcf8f5]">

      {/* PAGE HEADER */}

      <section className="bg-[#1e2b2b] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#d8b69b] uppercase tracking-[4px] text-sm mb-4">
            Discover Your Glow
          </p>

          <h1 className="text-4xl md:text-5xl font-serif mb-5">
            Our Shop
          </h1>

          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover skincare products carefully selected for
            your daily beauty routine.
          </p>
        </div>
      </section>

      {/* SHOP CONTENT */}

      <section className="max-w-7xl mx-auto px-4 py-10">

        {/* SEARCH AND FILTER BAR */}

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skincare products..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-[#e5d8ce] bg-white outline-none focus:border-[#b48b6a]"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1e2b2b] text-white hover:bg-[#b48b6a] transition w-full md:w-auto"
          >
            {showFilters ? <FaTimes /> : <FaFilter />}
            {showFilters ? "Close Filters" : "Filters"}
          </button>
        </div>

        {/* FILTER PANEL */}

        {showFilters && (
          <div className="bg-white rounded-2xl p-6 mb-8 border border-[#eaded5] shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <FaSlidersH className="text-[#b48b6a]" />

              <h2 className="text-xl font-semibold text-[#1e2b2b]">
                Filter Products
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              <div>
                <label className="block text-sm font-medium mb-2 text-[#1e2b2b]">
                  Category
                </label>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-[#b48b6a] bg-white"
                >
                  <option value="">All Categories</option>

                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category.toLowerCase().replace(/\s+/g, "-")}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#1e2b2b]">
                  Minimum Price (LKR)
                </label>

                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Minimum price"
                  className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-[#b48b6a]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[#1e2b2b]">
                  Maximum Price (LKR)
                </label>

                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Maximum price"
                  className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-[#b48b6a]"
                />
              </div>

            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                type="button"
                onClick={applyFilters}
                className="px-6 py-3 rounded-full bg-[#1e2b2b] text-white hover:bg-[#b48b6a] transition"
              >
                Apply Filters
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="px-6 py-3 rounded-full border border-[#b48b6a] text-[#1e2b2b] hover:bg-[#fcf0e8] transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* PRODUCT COUNT */}

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-[#1e2b2b]">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

          {(selectedCategory || minPrice || maxPrice || search) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-[#b48b6a] hover:underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* PRODUCT GRID */}

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filteredProducts.map((product) => {
              const productId = product._id || product.id;
              const image = getProductImage(product);
              const wished = isInWishlist(product);

              return (
                <div
                  key={productId}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 border border-[#f0e7e0]"
                >

                  {/* PRODUCT IMAGE */}

                  <div className="relative h-72 bg-[#f5eee8] overflow-hidden">
                    <Link
                      to={`/product/${productId}`}
                      className="block w-full h-full"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={product.name || product.title || "Skincare product"}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#b48b6a]">
                          <FaShoppingBag size={35} />
                          <span className="mt-3 text-sm">
                            Product image unavailable
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* WISHLIST HEART */}

                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      aria-label={
                        wished ? "Remove from wishlist" : "Add to wishlist"
                      }
                      aria-pressed={wished}
                      title={
                        wished ? "Remove from Wishlist" : "Add to Wishlist"
                      }
                      className={`absolute top-4 right-4 w-11 h-11 rounded-full backdrop-blur flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 ${
                        wished
                          ? "bg-[#b48b6a] text-white scale-110"
                          : "bg-white/95 text-[#b48b6a] hover:bg-[#b48b6a] hover:text-white"
                      }`}
                    >
                      <FaHeart size={19} />
                    </button>

                    {Number(product.stock) === 0 && (
                      <span className="absolute top-4 left-4 bg-gray-800 text-white text-xs px-3 py-2 rounded-full">
                        Out of Stock
                      </span>
                    )}

                    {product.category && (
                      <span className="absolute bottom-4 left-4 bg-white/90 text-[#1e2b2b] text-xs px-3 py-2 rounded-full">
                        {product.category}
                      </span>
                    )}
                  </div>

                  {/* PRODUCT DETAILS */}

                  <div className="p-5">
                    <Link to={`/product/${productId}`}>
                      <h3 className="text-lg font-semibold text-[#1e2b2b] mb-2 hover:text-[#b48b6a] transition">
                        {product.name || product.title || "Unnamed Product"}
                      </h3>
                    </Link>

                    {product.rating && (
                      <div className="flex items-center gap-1 mb-3">
                        <FaStar className="text-amber-400" />
                        <span className="text-sm text-gray-600">
                          {product.rating}
                        </span>
                      </div>
                    )}

                    {product.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-3 mt-4">
                      <p className="text-lg font-bold text-[#b48b6a]">
                        {formatPrice(product.price)}
                      </p>

                      <Link
                        to={`/product/${productId}`}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#1e2b2b] text-white text-sm hover:bg-[#b48b6a] transition"
                      >
                        <FaShoppingBag />
                        View
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 px-4">
            <div className="w-20 h-20 rounded-full bg-[#f1e5dc] flex items-center justify-center mx-auto mb-5">
              <FaShoppingBag className="text-[#b48b6a]" size={30} />
            </div>

            <h2 className="text-2xl font-serif text-[#1e2b2b] mb-3">
              No Products Found
            </h2>

            <p className="text-gray-500 max-w-md mx-auto mb-6">
              There are no products to display. Please add products
              through the Admin panel or try changing your filters.
            </p>

            {(selectedCategory || minPrice || maxPrice || search) && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-6 py-3 rounded-full bg-[#1e2b2b] text-white hover:bg-[#b48b6a] transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

      </section>
    </div>
  );
};

export default Shop;
