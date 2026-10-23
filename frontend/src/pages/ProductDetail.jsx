import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaStar,
  FaShoppingBag,
  FaArrowLeft,
  FaShareAlt,
  FaCheck,
  FaTruck,
  FaShieldAlt,
  FaUndo,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";

// ===============================
// DEFAULT PRODUCTS
// ===============================

const defaultProducts = [
  {
    id: 1,
    name: "Vitamin C Brightening Serum",
    price: 2990,
    originalPrice: 3490,
    category: "serum",
    stock: 25,
    rating: 4.8,
    reviewsCount: 124,
    description:
      "A lightweight Vitamin C serum designed to brighten the appearance of dull skin and support a more even-looking complexion.",
    benefits: [
      "Brightens dull-looking skin",
      "Helps improve the appearance of uneven tone",
      "Lightweight texture",
      "Suitable for daily skincare routines",
    ],
    ingredients: [
      "Vitamin C",
      "Hyaluronic Acid",
      "Vitamin E",
    ],
    howToUse:
      "Apply a few drops to clean, dry skin. Gently massage until absorbed. Follow with moisturizer and sunscreen.",
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85",
    ],
  },

  {
    id: 2,
    name: "Hydra Moisture Cream",
    price: 2490,
    originalPrice: 2990,
    category: "moisturizer",
    stock: 18,
    rating: 4.7,
    reviewsCount: 98,
    description:
      "A hydrating moisturizer that helps keep skin soft, comfortable and moisturized throughout the day.",
    benefits: [
      "Provides long-lasting hydration",
      "Helps maintain skin moisture",
      "Soft lightweight finish",
      "Suitable for daily use",
    ],
    ingredients: [
      "Hyaluronic Acid",
      "Ceramides",
      "Glycerin",
    ],
    howToUse:
      "Apply an appropriate amount to clean skin and gently massage until absorbed.",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=85",
    ],
  },

  {
    id: 3,
    name: "Glow Sunscreen SPF 50",
    price: 2790,
    originalPrice: 3290,
    category: "sunscreen",
    stock: 30,
    rating: 4.9,
    reviewsCount: 156,
    description:
      "A daily sunscreen with high SPF protection and a comfortable lightweight finish.",
    benefits: [
      "Broad-spectrum sun protection",
      "Lightweight texture",
      "Comfortable for everyday use",
      "Helps protect skin from UV exposure",
    ],
    ingredients: [
      "UV Filters",
      "Vitamin E",
      "Glycerin",
    ],
    howToUse:
      "Apply generously to exposed skin as the final step of your morning skincare routine. Reapply as needed.",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85",
    ],
  },
];

// ===============================
// PRODUCT DETAIL
// ===============================

const ProductDetail = () => {
  const { id } = useParams();

  const { user, token } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [myQuestions, setMyQuestions] = useState([]);
const [questionText, setQuestionText] = useState("");
const [questionsLoading, setQuestionsLoading] = useState(false);
const [submittingQuestion, setSubmittingQuestion] = useState(false);
  // ===============================
  // USER STORAGE KEYS
  // ===============================

  const getUserId = () => {
    if (!user) return null;

    if (user._id) {
      return user._id;
    }

    if (user.id) {
      return user.id;
    }

    if (user.email) {
      return user.email.toLowerCase();
    }

    return null;
  };

  const getCartKey = () => {
    const userId = getUserId();

    if (!userId) return null;

    return `cart_${userId}`;
  };

  const getWishlistKey = () => {
    const userId = getUserId();

    if (!userId) return null;

    return `wishlist_${userId}`;
  };

  // ===============================
  // LOAD PRODUCT
  // ===============================

 
  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setLoading(true);

      try {
        // 1. Load products saved in localStorage
        const savedProducts = JSON.parse(
          localStorage.getItem("products") || "[]"
        );

        const localProducts = [
          ...defaultProducts,
          ...(Array.isArray(savedProducts) ? savedProducts : []),
        ];

        // 2. Find product locally first
        let foundProduct = localProducts.find(
          (item) =>
            String(item._id || item.id) === String(id)
        );

        // 3. If not found locally, load from MongoDB API
        if (!foundProduct) {
          try {
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

            foundProduct = mongoProducts.find(
              (item) =>
                String(item._id || item.id) === String(id)
            );
          } catch (apiError) {
            console.error(
              "MongoDB product loading error:",
              apiError.response?.data || apiError.message
            );
          }
        }

        if (!isMounted) return;

        if (!foundProduct) {
          console.error("Product not found. Route ID:", id);
          setProduct(null);
          return;
        }

        // 4. Fix product images
        let productImages = [];

        if (
          Array.isArray(foundProduct.images) &&
          foundProduct.images.length > 0
        ) {
          productImages = foundProduct.images.filter(Boolean);
        } else if (
          foundProduct.image &&
          typeof foundProduct.image === "string"
        ) {
          productImages = [foundProduct.image];
        }

        if (productImages.length === 0) {
          productImages = [
            "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=85",
          ];
        }

        const fixedProduct = {
          ...foundProduct,
          images: productImages,
        };

        setProduct(fixedProduct);
        setSelectedImage(productImages[0]);

        // 5. Check user cart
        const cartKey = getCartKey();
        const cart = cartKey
          ? JSON.parse(localStorage.getItem(cartKey) || "[]")
          : [];

        setIsAddedToCart(
          cart.some(
            (item) =>
              String(item._id || item.id) ===
              String(fixedProduct._id || fixedProduct.id)
          )
        );

        // 6. Check user wishlist
        const wishlistKey = getWishlistKey();
        const wishlist = wishlistKey
          ? JSON.parse(localStorage.getItem(wishlistKey) || "[]")
          : [];

        setIsWishlist(
          wishlist.some(
            (item) =>
              String(item._id || item.id) ===
              String(fixedProduct._id || fixedProduct.id)
          )
        );
      } catch (error) {
        console.error("Error loading product:", error);

        if (isMounted) {
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id, user]);


  // ===============================
  // WISHLIST
  // ===============================

  const toggleWishlist = () => {
    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }

    if (
      user.role === "admin" ||
      user.role === "super_admin"
    ) {
      toast.error("Admin accounts cannot use customer wishlist");
      return;
    }

    if (!product) return;

    try {
      const wishlistKey = getWishlistKey();

      if (!wishlistKey) {
        toast.error("Please login first");
        return;
      }

      const wishlist = JSON.parse(
        localStorage.getItem(wishlistKey) || "[]"
      );

      if (isWishlist) {
        
const alreadyExists = wishlist.some(
  (item) =>
    String(item._id || item.id) ===
    String(product._id || product.id)
);


        localStorage.setItem(
          wishlistKey,
          JSON.stringify(updatedWishlist)
        );

        setIsWishlist(false);

        toast.success("Removed from wishlist");
      } else {
        const alreadyExists = wishlist.some(
          (item) =>
            String(item.id) === String(product.id)
        );

        if (!alreadyExists) {
          const updatedWishlist = [
            ...wishlist,
            product,
          ];

          localStorage.setItem(
            wishlistKey,
            JSON.stringify(updatedWishlist)
          );
        }

        setIsWishlist(true);

        toast.success("Added to wishlist");
      }

      window.dispatchEvent(
        new Event("wishlistUpdated")
      );
    } catch (error) {
      console.error("Wishlist error:", error);
      toast.error("Something went wrong");
    }
  };

  // ===============================
  // ADD TO CART
  // ===============================

  const addToCart = () => {
    if (!user) {
      toast.error("Please login before adding items to cart");
      return;
    }

    if (
      user.role === "admin" ||
      user.role === "super_admin"
    ) {
      toast.error("Admin accounts cannot add products to cart");
      return;
    }

    if (!product) return;

    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    try {
      const cartKey = getCartKey();

      if (!cartKey) {
        toast.error("Please login first");
        return;
      }

      const cart = JSON.parse(
        localStorage.getItem(cartKey) || "[]"
      );

      
const existingProductIndex = cart.findIndex(
  (item) =>
    String(item._id || item.id) ===
    String(product._id || product.id)
);


      if (existingProductIndex !== -1) {
        const currentQuantity = Number(
          cart[existingProductIndex].quantity || 0
        );

        const newQuantity =
          currentQuantity + quantity;

        if (newQuantity > product.stock) {
          toast.error(
            `Only ${product.stock} items available`
          );
          return;
        }

        cart[existingProductIndex].quantity =
          newQuantity;
      } else {
        cart.push({
          ...product,
          quantity,
        });
      }

      localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
      );

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      setIsAddedToCart(true);

      toast.success("Added to cart");
    } catch (error) {
      console.error("Cart error:", error);
      toast.error("Unable to add to cart");
    }
  };
  // ===============================
// PRODUCT QUESTIONS & ANSWERS
// ===============================

useEffect(() => {
  let isMounted = true;

  const loadMyQuestions = async () => {
    if (!user || !token || !product?._id) {
      setMyQuestions([]);
      return;
    }

    if (user.role === "admin" || user.role === "super_admin") {
      setMyQuestions([]);
      return;
    }

    setQuestionsLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:5000/api/product-questions/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const questions = response.data.questions || [];

      const productQuestions = questions.filter(
        (item) =>
          String(item.product?._id || item.product) ===
          String(product._id)
      );

      if (isMounted) {
        setMyQuestions(productQuestions);
      }
    } catch (error) {
      console.error(
        "Load questions error:",
        error.response?.data || error.message
      );
    } finally {
      if (isMounted) {
        setQuestionsLoading(false);
      }
    }
  };

  loadMyQuestions();

  return () => {
    isMounted = false;
  };
}, [product, user, token]);

// SUBMIT A QUESTION
const submitQuestion = async (e) => {
  e.preventDefault();

  if (!user || !token) {
    toast.error("Please login to ask a question");
    return;
  }

  if (user.role === "admin" || user.role === "super_admin") {
    toast.error("Admin accounts cannot ask customer questions");
    return;
  }

  if (!product?._id) {
    toast.error("Questions are available for database products only");
    return;
  }

  if (!questionText.trim()) {
    toast.error("Please enter your question");
    return;
  }

  setSubmittingQuestion(true);

  try {
    const response = await axios.post(
      `http://localhost:5000/api/product-questions/product/${product._id}`,
      {
        question: questionText.trim(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMyQuestions((previous) => [
      response.data.question,
      ...previous,
    ]);

    setQuestionText("");

    toast.success("Your question has been submitted");
  } catch (error) {
    console.error(
      "Submit question error:",
      error.response?.data || error.message
    );

    toast.error(
      error.response?.data?.message ||
        "Unable to submit your question"
    );
  } finally {
    setSubmittingQuestion(false);
  }
};
  // ===============================
  // SHARE
  // ===============================

  const shareProduct = async () => {
    try {
      const shareData = {
        title: product.name,
        text: product.description,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          window.location.href
        );

        toast.success("Product link copied");
      }
    } catch (error) {
      console.log("Share cancelled");
    }
  };

  // ===============================
  // QUANTITY
  // ===============================

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error("Maximum available stock reached");
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // ===============================
  // IMAGE ERROR
  // ===============================

  const handleImageError = (e) => {
    e.currentTarget.src =
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=85";
  };

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  // ===============================
  // PRODUCT NOT FOUND
  // ===============================

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-3">
            Product Not Found
          </h2>

          <p className="text-gray-500 mb-6">
            Sorry, we couldn't find this product.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
          >
            <FaArrowLeft />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // ===============================
  // IMAGE ARRAY
  // ===============================

  const images =
    Array.isArray(product.images) &&
    product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [
          "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=85",
        ];

  // ===============================
  // DISCOUNT
  // ===============================

  const discount =
    product.originalPrice &&
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : 0;

  // ===============================
  // CATEGORY NAME
  // ===============================

  const categoryName =
    product.category
      ?.replace("-", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      ) || "Beauty";

  // ===============================
  // RETURN
  // ===============================

  return (
    <div className="min-h-screen bg-[#faf9f7]">

      {/* ================================= */}
      {/* BREADCRUMB */}
      {/* ================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition"
        >
          <FaArrowLeft size={14} />
          Back to Shop
        </Link>
      </div>

      {/* ================================= */}
      {/* PRODUCT SECTION */}
      {/* ================================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ================================= */}
          {/* LEFT - IMAGES */}
          {/* ================================= */}

          <div>

            {/* MAIN IMAGE */}

            <div className="relative bg-white rounded-2xl overflow-hidden aspect-square">

              {discount > 0 && (
                <div className="absolute top-5 left-5 z-10 bg-black text-white px-4 py-2 rounded-full text-sm font-medium">
                  {discount}% OFF
                </div>
              )}

              <img
                src={selectedImage || images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />

              {/* Wishlist */}

              <button
  onClick={toggleWishlist}
  className={`absolute top-5 right-5 w-12 h-12 rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-all duration-300 ${
    isWishlist
      ? "bg-[#b48b6a] scale-105"
      : "bg-white hover:bg-[#f3ede8]"
  }`}
  title={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
>
  {isWishlist ? (
    <FaHeart
      className="text-white"
      size={20}
    />
  ) : (
    <FaRegHeart
      className="text-gray-700"
      size={20}
    />
  )}
</button>
            </div>

            {/* THUMBNAILS */}

            {images.length > 1 && (
              <div className="flex gap-4 mt-4 overflow-x-auto">

                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() =>
                      setSelectedImage(image)
                    }
                    className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${
                      selectedImage === image
                        ? "border-black"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </button>
                ))}

              </div>
            )}
          </div>

          {/* ================================= */}
          {/* RIGHT - DETAILS */}
          {/* ================================= */}

          <div className="flex flex-col justify-center">

            {/* CATEGORY */}

            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-3">
              {categoryName}
            </p>

            {/* NAME */}

            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-tight mb-5">
              {product.name}
            </h1>

            {/* RATING */}

            <div className="flex items-center gap-3 mb-6">

              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-500" />

                <span className="font-medium">
                  {product.rating || 4.8}
                </span>
              </div>

              <span className="text-gray-400">
                |
              </span>

              <span className="text-gray-500">
                {product.reviewsCount || 0} reviews
              </span>

            </div>

            {/* PRICE */}

            <div className="flex items-center gap-4 mb-6">

              <span className="text-3xl font-semibold text-gray-900">
                LKR{" "}
                {Number(
                  product.price
                ).toLocaleString()}
              </span>

              {product.originalPrice &&
                product.originalPrice >
                  product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    LKR{" "}
                    {Number(
                      product.originalPrice
                    ).toLocaleString()}
                  </span>
                )}

            </div>

            {/* DESCRIPTION */}

            <p className="text-gray-600 leading-7 mb-8">
              {product.description}
            </p>

            {/* STOCK */}

            <div className="mb-7">

              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-green-700">

                  <FaCheck size={14} />

                  <span className="font-medium">
                    In Stock
                  </span>

                  <span className="text-gray-500">
                    ({product.stock} available)
                  </span>

                </div>
              ) : (
                <div className="text-red-600 font-medium">
                  Out of Stock
                </div>
              )}

            </div>

            {/* QUANTITY */}

            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">

                <span className="font-medium">
                  Quantity
                </span>

                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">

                  <button
                    onClick={decreaseQuantity}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>

                  <span className="w-10 text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>

                </div>

              </div>
            )}

            {/* ACTION BUTTONS */}

            <div className="flex gap-3 mb-8">

              <button
                onClick={addToCart}
                disabled={product.stock <= 0}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-full font-medium transition-all duration-300 ${
                  product.stock <= 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    :isAddedToCart
  ? "bg-[#b48b6a] text-white hover:bg-[#9f7658]"
  : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isAddedToCart ? (
                  <>
                    <FaCheck />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <FaShoppingBag />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                onClick={shareProduct}
                className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <FaShareAlt />
              </button>

            </div>

            {/* SERVICE INFO */}

            <div className="border-t border-gray-200 pt-6 space-y-5">

              <div className="flex items-center gap-4">

                <FaTruck className="text-gray-700" />

                <div>
                  <p className="font-medium">
                    Fast Delivery
                  </p>

                  <p className="text-sm text-gray-500">
                    Islandwide delivery available
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-4">

                <FaShieldAlt className="text-gray-700" />

                <div>
                  <p className="font-medium">
                    Secure Shopping
                  </p>

                  <p className="text-sm text-gray-500">
                    Safe and secure checkout
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-4">

                <FaUndo className="text-gray-700" />

                <div>
                  <p className="font-medium">
                    Easy Returns
                  </p>

                  <p className="text-sm text-gray-500">
                    Simple return process
                  </p>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================================= */}
      {/* PRODUCT INFORMATION */}
      {/* ================================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* BENEFITS */}

          {product.benefits &&
            product.benefits.length > 0 && (
              <div className="bg-white rounded-2xl p-7">

                <h3 className="text-xl font-semibold mb-5">
                  Benefits
                </h3>

                <ul className="space-y-3">

                  {product.benefits.map(
                    (benefit, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-600"
                      >

                        <FaCheck
                          className="text-green-600 mt-1 flex-shrink-0"
                          size={13}
                        />

                        <span>{benefit}</span>

                      </li>
                    )
                  )}

                </ul>
              </div>
            )}

          {/* INGREDIENTS */}

          {product.ingredients &&
            product.ingredients.length > 0 && (
              <div className="bg-white rounded-2xl p-7">

                <h3 className="text-xl font-semibold mb-5">
                  Key Ingredients
                </h3>

                <div className="flex flex-wrap gap-2">

                  {product.ingredients.map(
                    (ingredient, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-gray-100 rounded-full text-sm text-gray-700"
                      >
                        {ingredient}
                      </span>
                    )
                  )}

                </div>
              </div>
            )}

          {/* HOW TO USE */}

          {product.howToUse && (
            <div className="bg-white rounded-2xl p-7">

              <h3 className="text-xl font-semibold mb-5">
                How To Use
              </h3>

              <p className="text-gray-600 leading-7">
                {product.howToUse}
              </p>

            </div>
          )}

        </div>

      </section>
{/* ================================= */}
{/* PRODUCT QUESTIONS & ANSWERS */}
{/* ================================= */}

<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
  <div className="bg-white rounded-2xl p-6 sm:p-8">
    <div className="mb-7">
      <p className="text-sm uppercase tracking-[0.2em] text-[#b48b6a] mb-2">
        Customer Support
      </p>

      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
        Product Questions & Answers
      </h2>

      <p className="text-gray-500 mt-2">
        Ask us about this product and view replies from our team.
        Only you can see the questions you submitted.
      </p>
    </div>

    {!user ? (
      <div className="rounded-xl bg-[#faf9f7] p-5">
        <p className="text-gray-700 mb-4">
          Please log in to ask a question and view your replies.
        </p>

        <Link
          to="/login"
          className="inline-block bg-[#b48b6a] text-white px-6 py-3 rounded-full hover:bg-[#9f7658] transition"
        >
          Login to Ask
        </Link>
      </div>
    ) : user.role === "admin" || user.role === "super_admin" ? (
      <p className="text-gray-500 bg-[#faf9f7] rounded-xl p-5">
        Admin accounts can manage customer questions from the
        admin section.
      </p>
    ) : (
      <>
        <form onSubmit={submitQuestion} className="mb-10">
          <label
            htmlFor="product-question"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your question about {product.name}
          </label>

          <textarea
            id="product-question"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Ask about ingredients, usage, skin type..."
            maxLength={1000}
            rows={4}
            className="w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-[#b48b6a] focus:ring-1 focus:ring-[#b48b6a] resize-y"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <span className="text-xs text-gray-400">
              {questionText.length}/1000 characters
            </span>

            <button
              type="submit"
              disabled={submittingQuestion || !questionText.trim()}
              className="px-6 py-3 rounded-full bg-[#b48b6a] text-white hover:bg-[#9f7658] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingQuestion ? "Submitting..." : "Submit Question"}
            </button>
          </div>
        </form>

        <div className="border-t border-gray-200 pt-7">
          <h3 className="text-xl font-semibold text-gray-900 mb-5">
            Your Questions
          </h3>

          {questionsLoading ? (
            <p className="text-gray-500 py-5">
              Loading your questions...
            </p>
          ) : myQuestions.length === 0 ? (
            <div className="bg-[#faf9f7] rounded-xl p-6 text-center">
              <p className="text-gray-600">
                You haven't asked a question about this product yet.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {myQuestions.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-100 rounded-xl p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-sm text-gray-500">
                      Your question
                    </span>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        item.status === "answered"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {item.status === "answered"
                        ? "Answered"
                        : "Awaiting Reply"}
                    </span>
                  </div>

                  <p className="text-gray-800 leading-7 whitespace-pre-wrap">
                    {item.question}
                  </p>

                  {item.answer ? (
                    <div className="mt-5 bg-[#faf6f2] rounded-xl p-4">
                      <p className="text-sm font-semibold text-[#9f7658] mb-2">
                        Lumière Team Reply
                      </p>

                      <p className="text-gray-700 leading-7 whitespace-pre-wrap">
                        {item.answer}
                      </p>

                      {item.answeredBy?.name && (
                        <p className="text-xs text-gray-500 mt-3">
                          Replied by {item.answeredBy.name}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-4">
                      Our team will reply to your question soon.
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-4">
                    Asked on{" "}
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    )}
  </div>
</section>
    </div>
  );
};

export default ProductDetail;