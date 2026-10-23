import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaShoppingBag,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const { user } = useAuth();

  // ==========================================
  // USER CART KEY
  // ==========================================

  const getCartKey = () => {
    if (!user) return null;

    if (user._id) {
      return `cart_${user._id}`;
    }

    if (user.id) {
      return `cart_${user.id}`;
    }

    if (user.email) {
      return `cart_${user.email.toLowerCase()}`;
    }

    return null;
  };

  // ==========================================
  // LOAD CART
  // ==========================================

  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = () => {
    try {
      const cartKey = getCartKey();

      if (!cartKey) {
        setCartItems([]);
        return;
      }

      const savedCart = JSON.parse(
        localStorage.getItem(cartKey) || "[]"
      );

      if (Array.isArray(savedCart)) {
        setCartItems(savedCart);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    }
  };

  // ==========================================
  // SAVE CART
  // ==========================================

  const saveCart = (updatedCart) => {
    const cartKey = getCartKey();

    if (!cartKey) {
      toast.error("Please login to manage your cart");
      return;
    }

    setCartItems(updatedCart);

    localStorage.setItem(
      cartKey,
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) => {
      if (String(item.id) === String(id)) {
        const stock = Number(item.stock) || 999;

        if (item.quantity < stock) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }

        toast.error("Maximum available stock reached");

        return item;
      }

      return item;
    });

    saveCart(updatedCart);
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQuantity = (id) => {
    const updatedCart = cartItems
      .map((item) => {
        if (String(item.id) === String(id)) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(
      (item) =>
        String(item.id) !== String(id)
    );

    saveCart(updatedCart);

    toast.success("Item removed from cart");
  };

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

          <div className="max-w-md mx-auto text-center">

            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#f3ede8] flex items-center justify-center">
              <FaShoppingBag
                size={32}
                className="text-[#b48b6a]"
              />
            </div>

            <h2 className="text-3xl font-light text-[#2c2520] mb-4">
              Please Login
            </h2>

            <p className="text-[#4d453e] mb-8">
              Please login to view and manage your shopping cart.
            </p>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-[#b48b6a] hover:bg-[#967052] text-white px-7 py-3.5 rounded-full font-medium transition duration-300 shadow-sm"
            >
              Login
            </Link>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // ADMIN
  // ==========================================

  if (
    user.role === "admin" ||
    user.role === "super_admin"
  ) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

          <div className="max-w-md mx-auto text-center">

            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#f3ede8] flex items-center justify-center">
              <FaShoppingBag
                size={32}
                className="text-[#b48b6a]"
              />
            </div>

            <h2 className="text-3xl font-light text-[#2c2520] mb-4">
              Admin Account
            </h2>

            <p className="text-[#4d453e] mb-8">
              Admin accounts do not have a customer shopping cart.
            </p>

            <Link
              to="/admin"
              className="inline-flex items-center gap-2 bg-[#b48b6a] hover:bg-[#967052] text-white px-7 py-3.5 rounded-full font-medium transition duration-300 shadow-sm"
            >
              Go to Admin Dashboard
            </Link>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // CALCULATIONS
  // ==========================================

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  const shipping = subtotal >= 5000 ? 0 : 500;

  const total = subtotal + shipping;

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

          <div className="max-w-md mx-auto text-center">

            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#f3ede8] flex items-center justify-center">
              <FaShoppingBag
                size={32}
                className="text-[#b48b6a]"
              />
            </div>

            <h2 className="text-3xl font-light text-[#2c2520] mb-4">
              Your Cart is Empty
            </h2>

            <p className="text-[#4d453e] mb-8">
              Start shopping to add your favourite
              skincare products to your cart.
            </p>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#b48b6a] hover:bg-[#967052] text-white px-7 py-3.5 rounded-full font-medium transition duration-300 shadow-sm"
            >
              <FaArrowLeft size={14} />
              Start Shopping
            </Link>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // MAIN CART
  // ==========================================

  return (
    <div className="min-h-screen bg-[#faf9f7]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">

          <div>
            <h1 className="text-3xl md:text-4xl font-light text-[#2c2520]">
              Your Cart
            </h1>

            <p className="text-[#4d453e] mt-2">
              {cartItems.length}{" "}
              {cartItems.length === 1
                ? "item"
                : "items"}{" "}
              in your cart
            </p>
          </div>

          <Link
            to="/shop"
            className="text-sm text-[#4d453e] hover:text-[#b48b6a] transition"
          >
            Continue Shopping
          </Link>

        </div>

        {/* CART CONTENT */}

        <div className="flex flex-col lg:flex-row gap-8">

          {/* CART ITEMS */}

          <div className="lg:w-2/3">

            <div className="bg-white rounded-3xl p-5 md:p-7 shadow-sm">

              {cartItems.map((item) => {

                const itemImage =
                  Array.isArray(item.images) &&
                  item.images.length > 0
                    ? item.images[0]
                    : item.image || "";

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 md:gap-6 py-6 border-b border-[#e6ddd5] last:border-0"
                  >

                    {/* IMAGE */}

                    <Link
                      to={`/product/${item.id}`}
                      className="w-24 h-24 md:w-28 md:h-28 bg-[#f3ede8] rounded-2xl overflow-hidden flex-shrink-0"
                    >

                      {itemImage ? (
                        <img
                          src={itemImage}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaShoppingBag
                            className="text-[#b48b6a]"
                            size={25}
                          />
                        </div>
                      )}

                    </Link>

                    {/* DETAILS */}

                    <div className="flex-1 min-w-0">

                      <Link
                        to={`/product/${item.id}`}
                        className="block font-semibold text-[#2c2520] hover:text-[#b48b6a] transition truncate"
                      >
                        {item.name}
                      </Link>

                      <p className="text-[#4d453e] text-sm mt-1">
                        LKR{" "}
                        {Number(
                          item.price || 0
                        ).toLocaleString()}
                      </p>

                      {/* QUANTITY */}

                      <div className="flex items-center gap-3 mt-4">

                        <button
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                          className="w-8 h-8 rounded-full border border-[#d8ccc2] flex items-center justify-center text-[#4d453e] hover:bg-[#f3ede8] hover:border-[#b48b6a] transition"
                        >
                          <FaMinus size={10} />
                        </button>

                        <span className="w-8 text-center font-medium text-[#2c2520]">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                          className="w-8 h-8 rounded-full border border-[#d8ccc2] flex items-center justify-center text-[#4d453e] hover:bg-[#f3ede8] hover:border-[#b48b6a] transition"
                        >
                          <FaPlus size={10} />
                        </button>

                        {/* DELETE */}

                        <button
                          onClick={() =>
                            removeItem(item.id)
                          }
                          className="ml-3 text-red-400 hover:text-red-600 transition"
                          title="Remove item"
                        >
                          <FaTrash size={14} />
                        </button>

                      </div>

                    </div>

                    {/* ITEM TOTAL */}

                    <div className="text-right flex-shrink-0">

                      <p className="font-semibold text-[#2c2520]">
                        LKR{" "}
                        {(
                          Number(item.price || 0) *
                          Number(item.quantity || 1)
                        ).toLocaleString()}
                      </p>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          {/* ORDER SUMMARY */}

          <div className="lg:w-1/3">

            <div className="bg-white rounded-3xl p-6 md:p-7 shadow-sm lg:sticky lg:top-24">

              <h3 className="text-xl font-semibold text-[#2c2520] mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 text-sm">

                {/* SUBTOTAL */}

                <div className="flex justify-between">

                  <span className="text-[#4d453e]">
                    Subtotal
                  </span>

                  <span className="font-medium text-[#2c2520]">
                    LKR{" "}
                    {subtotal.toLocaleString()}
                  </span>

                </div>

                {/* SHIPPING */}

                <div className="flex justify-between">

                  <span className="text-[#4d453e]">
                    Shipping
                  </span>

                  <span className="font-medium text-[#2c2520]">
                    {shipping === 0
                      ? "FREE"
                      : `LKR ${shipping.toLocaleString()}`}
                  </span>

                </div>

                {/* SHIPPING MESSAGE */}

                {shipping === 0 ? (
                  <div className="bg-green-50 rounded-xl px-4 py-3">
                    <p className="text-green-700 text-xs">
                      🎉 You've earned free shipping!
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#faf6f2] rounded-xl px-4 py-3">
                    <p className="text-[#6b5b4f] text-xs">
                      Add LKR{" "}
                      {(
                        5000 - subtotal
                      ).toLocaleString()}{" "}
                      more for free shipping.
                    </p>
                  </div>
                )}

                {/* TOTAL */}

                <div className="border-t border-[#e6ddd5] pt-5">

                  <div className="flex justify-between items-center">

                    <span className="text-lg font-semibold text-[#2c2520]">
                      Total
                    </span>

                    <span className="text-xl font-bold text-[#2c2520]">
                      LKR{" "}
                      {total.toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>

              {/* CHECKOUT */}

              <Link
                to="/checkout"
                className="w-full text-center block mt-7 bg-[#b48b6a] hover:bg-[#967052] text-white py-4 rounded-full font-medium transition duration-300 shadow-sm hover:shadow-md"
              >
                Proceed to Checkout
              </Link>

              {/* CONTINUE SHOPPING */}

              <Link
                to="/shop"
                className="flex items-center justify-center gap-2 text-sm text-[#4d453e] mt-5 hover:text-[#b48b6a] transition"
              >
                <FaArrowLeft size={11} />
                Continue Shopping
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;