import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaCreditCard,
  FaMoneyBillWave,
  FaShoppingBag,
  FaTruck,
  FaLock,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [loading, setLoading] = useState(false);

  // ==========================================
  // GET CURRENT USER ID
  // ==========================================

  const getUserId = () => {
    if (!user) return null;

    if (user._id) return user._id;
    if (user.id) return user.id;
    if (user.email) return user.email.toLowerCase();

    return null;
  };

  // ==========================================
  // USER-SPECIFIC CART KEY
  // ==========================================

  const getCartKey = () => {
    const userId = getUserId();

    if (!userId) return null;

    return `cart_${userId}`;
  };

  // ==========================================
  // USER-SPECIFIC ORDERS KEY
  // ==========================================

  const getOrdersKey = () => {
    const userId = getUserId();

    if (!userId) return null;

    return `orders_${userId}`;
  };

  // ==========================================
  // LOAD USER CART
  // ==========================================

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

    if (
      user.role === "admin" ||
      user.role === "super_admin"
    ) {
      setCartItems([]);
      return;
    }

    const cartKey = getCartKey();

    if (!cartKey) {
      setCartItems([]);
      return;
    }

    try {
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
  }, [user]);

  // ==========================================
  // LOAD USER INFORMATION
  // ==========================================

  useEffect(() => {
    if (!user) return;

    setFormData((prev) => ({
      ...prev,
      fullName: user.name || prev.fullName,
      email: user.email || prev.email,
    }));
  }, [user]);

  // ==========================================
  // LISTEN FOR CART UPDATES
  // ==========================================

  useEffect(() => {
    const handleCartUpdate = () => {
      if (!user) return;

      const cartKey = getCartKey();

      if (!cartKey) return;

      try {
        const savedCart = JSON.parse(
          localStorage.getItem(cartKey) || "[]"
        );

        setCartItems(
          Array.isArray(savedCart) ? savedCart : []
        );
      } catch (error) {
        console.error("Cart update error:", error);
      }
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdate
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdate
      );
    };
  }, [user]);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // CARD CHANGE
  // ==========================================

  const handleCardChange = (e) => {
    const { name, value } = e.target;

    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // FORMAT CARD NUMBER
  // ==========================================

  const formatCardNumber = (value) => {
    const numbersOnly = value
      .replace(/\D/g, "")
      .slice(0, 16);

    return numbersOnly
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  // ==========================================
  // FORMAT EXPIRY
  // ==========================================

  const formatExpiry = (value) => {
    const numbersOnly = value
      .replace(/\D/g, "")
      .slice(0, 4);

    if (numbersOnly.length >= 3) {
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
    }

    return numbersOnly;
  };

  // ==========================================
  // CARD NUMBER CHANGE
  // ==========================================

  const handleCardNumberChange = (e) => {
    setCardData((prev) => ({
      ...prev,
      cardNumber: formatCardNumber(e.target.value),
    }));
  };

  // ==========================================
  // EXPIRY CHANGE
  // ==========================================

  const handleExpiryChange = (e) => {
    setCardData((prev) => ({
      ...prev,
      expiry: formatExpiry(e.target.value),
    }));
  };

  // ==========================================
  // CVV CHANGE
  // ==========================================

  const handleCvvChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 4);

    setCardData((prev) => ({
      ...prev,
      cvv: value,
    }));
  };

  // ==========================================
  // CALCULATE TOTALS
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
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // ------------------------------------------
    // CHECK LOGIN
    // ------------------------------------------

    if (!user) {
      toast.error(
        "Please login before placing an order"
      );

      navigate("/user-login");
      return;
    }

    // ------------------------------------------
    // ADMIN CHECK
    // ------------------------------------------

    if (
      user.role === "admin" ||
      user.role === "super_admin"
    ) {
      toast.error(
        "Admin accounts cannot place customer orders"
      );

      navigate("/admin");
      return;
    }

    // ------------------------------------------
    // CHECK CART
    // ------------------------------------------

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // ------------------------------------------
    // CHECK DELIVERY DETAILS
    // ------------------------------------------

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.address.trim() ||
      !formData.city.trim()
    ) {
      toast.error(
        "Please fill all delivery details"
      );
      return;
    }

    // ------------------------------------------
    // CARD VALIDATION
    // ------------------------------------------

    if (paymentMethod === "card") {
      const cleanCardNumber =
        cardData.cardNumber.replace(/\s/g, "");

      if (
        !cardData.cardName.trim() ||
        !cleanCardNumber ||
        !cardData.expiry ||
        !cardData.cvv
      ) {
        toast.error(
          "Please fill all card details"
        );
        return;
      }

      if (cleanCardNumber.length !== 16) {
        toast.error(
          "Please enter a valid 16-digit card number"
        );
        return;
      }

      if (cardData.expiry.length !== 5) {
        toast.error(
          "Please enter expiry date as MM/YY"
        );
        return;
      }

      if (cardData.cvv.length < 3) {
        toast.error(
          "Please enter a valid CVV"
        );
        return;
      }
    }

    setLoading(true);

    try {
      const ordersKey = getOrdersKey();
      const cartKey = getCartKey();

      if (!ordersKey || !cartKey) {
        toast.error(
          "Unable to identify your account"
        );

        setLoading(false);
        return;
      }

      // ------------------------------------------
      // CREATE ORDER
      // ------------------------------------------

      const order = {
        id: `ORD-${Date.now()}`,

        userId: getUserId(),

        items: cartItems,

        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
        },

        paymentMethod,

        paymentStatus:
          paymentMethod === "card"
            ? "Paid"
            : "Pending",

        subtotal,
        shipping,
        total,

        status: "Pending",

        createdAt: new Date().toISOString(),
      };

      // ------------------------------------------
      // GET THIS USER'S ORDERS ONLY
      // ------------------------------------------

      let existingOrders = [];

      try {
        const savedOrders = JSON.parse(
          localStorage.getItem(ordersKey) || "[]"
        );

        if (Array.isArray(savedOrders)) {
          existingOrders = savedOrders;
        }
      } catch (error) {
        console.error(
          "Error reading existing orders:",
          error
        );
      }

      // ------------------------------------------
      // SAVE USER-SPECIFIC ORDER
      // ------------------------------------------

      const updatedOrders = [
        ...existingOrders,
        order,
      ];

      localStorage.setItem(
        ordersKey,
        JSON.stringify(updatedOrders)
      );

      // ------------------------------------------
      // ORDER UPDATE EVENT
      // ------------------------------------------

      window.dispatchEvent(
        new Event("ordersUpdated")
      );

      // ------------------------------------------
      // CLEAR ONLY THIS USER'S CART
      // ------------------------------------------

      localStorage.setItem(
        cartKey,
        JSON.stringify([])
      );

      // ------------------------------------------
      // CART UPDATE EVENT
      // ------------------------------------------

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      // ------------------------------------------
      // UPDATE STATE
      // ------------------------------------------

      setCartItems([]);

      // ------------------------------------------
      // SUCCESS MESSAGE
      // ------------------------------------------

      toast.success(
        paymentMethod === "card"
          ? "Payment successful! Order placed."
          : "Order placed successfully!"
      );

      // ------------------------------------------
      // GO TO ORDERS
      // ------------------------------------------

      setTimeout(() => {
        navigate("/orders");
      }, 700);
    } catch (error) {
      console.error("Order error:", error);

      toast.error(
        "Unable to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
        <div className="text-center">

          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#f3ede8] flex items-center justify-center">
            <FaShoppingBag
              size={32}
              className="text-[#b48b6a]"
            />
          </div>

          <h2 className="text-3xl font-light text-[#2c2520] mb-4">
            Please Login First
          </h2>

          <p className="text-[#4d453e] mb-8">
            You need to login before proceeding to checkout.
          </p>

          <Link
            to="/user-login"
            className="inline-flex items-center gap-2 bg-[#b48b6a] hover:bg-[#967052] text-white px-7 py-3.5 rounded-full font-medium transition"
          >
            Login
          </Link>

        </div>
      </div>
    );
  }

  // ==========================================
  // ADMIN ACCOUNT
  // ==========================================

  if (
    user.role === "admin" ||
    user.role === "super_admin"
  ) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
        <div className="text-center">

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
            Admin accounts cannot place customer orders.
          </p>

          <Link
            to="/admin"
            className="inline-flex items-center gap-2 bg-[#b48b6a] hover:bg-[#967052] text-white px-7 py-3.5 rounded-full font-medium transition"
          >
            Go to Admin Dashboard
          </Link>

        </div>
      </div>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
        <div className="text-center">

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
            Add some products before proceeding
            to checkout.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#b48b6a] hover:bg-[#967052] text-white px-7 py-3.5 rounded-full font-medium transition"
          >
            <FaArrowLeft size={14} />
            Start Shopping
          </Link>

        </div>
      </div>
    );
  }

  // ==========================================
  // CHECKOUT UI
  // ==========================================

  return (
    <div className="min-h-screen bg-[#faf9f7]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-[#4d453e] hover:text-[#b48b6a] transition"
        >
          <FaArrowLeft size={13} />
          Back to Cart
        </Link>

        <h1 className="text-3xl md:text-4xl font-light text-[#2c2520] mt-6">
          Checkout
        </h1>

        <p className="text-[#4d453e] mt-2">
          Complete your order details below.
        </p>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >

          {/* ======================================
              LEFT SIDE
          ====================================== */}

          <div className="lg:col-span-2 space-y-6">

            {/* DELIVERY INFORMATION */}

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">

              <div className="flex items-center gap-3 mb-7">

                <div className="w-10 h-10 rounded-full bg-[#f3ede8] flex items-center justify-center">
                  <FaTruck className="text-[#b48b6a]" />
                </div>

                <div>

                  <h2 className="text-xl font-semibold text-[#2c2520]">
                    Delivery Information
                  </h2>

                  <p className="text-sm text-[#6b5b4f]">
                    Enter your delivery details
                  </p>

                </div>

              </div>

              {/* FULL NAME */}

              <div className="mb-5">

                <label className="block text-sm font-medium text-[#2c2520] mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3.5 border border-[#d8ccc2] rounded-xl outline-none focus:border-[#b48b6a] transition"
                  required
                />

              </div>

              {/* PHONE + EMAIL */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium text-[#2c2520] mb-2">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="07XXXXXXXX"
                    className="w-full px-4 py-3.5 border border-[#d8ccc2] rounded-xl outline-none focus:border-[#b48b6a] transition"
                    required
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-[#2c2520] mb-2">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="w-full px-4 py-3.5 border border-[#d8ccc2] rounded-xl outline-none focus:border-[#b48b6a] transition"
                    required
                  />

                </div>

              </div>

              {/* ADDRESS */}

              <div className="mt-5">

                <label className="block text-sm font-medium text-[#2c2520] mb-2">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House number, street, area..."
                  rows="4"
                  className="w-full px-4 py-3.5 border border-[#d8ccc2] rounded-xl outline-none focus:border-[#b48b6a] transition resize-none"
                  required
                />

              </div>

              {/* CITY */}

              <div className="mt-5">

                <label className="block text-sm font-medium text-[#2c2520] mb-2">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  className="w-full px-4 py-3.5 border border-[#d8ccc2] rounded-xl outline-none focus:border-[#b48b6a] transition"
                  required
                />

              </div>

            </div>

            {/* ==================================
                PAYMENT
            ================================== */}

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">

              <h2 className="text-xl font-semibold text-[#2c2520] mb-6">
                Payment Method
              </h2>

              <div className="space-y-4">

                {/* COD */}

                <label
                  className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-[#b48b6a] bg-[#faf6f2]"
                      : "border-[#e6ddd5]"
                  }`}
                >

                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                    className="accent-[#b48b6a]"
                  />

                  <FaMoneyBillWave className="text-[#b48b6a] text-xl" />

                  <div>

                    <p className="font-medium text-[#2c2520]">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-[#6b5b4f]">
                      Pay when your order arrives.
                    </p>

                  </div>

                </label>

                {/* CARD */}

                <label
                  className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === "card"
                      ? "border-[#b48b6a] bg-[#faf6f2]"
                      : "border-[#e6ddd5]"
                  }`}
                >

                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                    className="accent-[#b48b6a]"
                  />

                  <FaCreditCard className="text-[#b48b6a] text-xl" />

                  <div>

                    <p className="font-medium text-[#2c2520]">
                      Card Payment
                    </p>

                    <p className="text-sm text-[#6b5b4f]">
                      Pay securely using your card.
                    </p>

                  </div>

                </label>

                {/* CARD DETAILS */}

                {paymentMethod === "card" && (
                  <div className="mt-5 p-5 md:p-6 rounded-2xl bg-[#faf9f7] border border-[#e6ddd5]">

                    <div className="flex items-center gap-3 mb-5">

                      <div className="w-10 h-10 rounded-xl bg-[#f3ede8] flex items-center justify-center">
                        <FaCreditCard className="text-[#b48b6a]" />
                      </div>

                      <div>

                        <h3 className="font-semibold text-[#2c2520]">
                          Card Details
                        </h3>

                        <p className="text-xs text-[#6b5b4f]">
                          Enter your card information
                        </p>

                      </div>

                    </div>

                    {/* CARD NAME */}

                    <div className="mb-4">

                      <label className="block text-sm font-medium text-[#2c2520] mb-2">
                        Name on Card
                      </label>

                      <input
                        type="text"
                        name="cardName"
                        value={cardData.cardName}
                        onChange={handleCardChange}
                        placeholder="Enter name on card"
                        className="w-full px-4 py-3.5 border border-[#d8ccc2] rounded-xl outline-none focus:border-[#b48b6a] transition"
                        required={paymentMethod === "card"}
                      />

                    </div>

                    {/* CARD NUMBER */}

                    <div className="mb-4">

                      <label className="block text-sm font-medium text-[#2c2520] mb-2">
                        Card Number
                      </label>

                      <div className="relative">

                        <input
                          type="text"
                          name="cardNumber"
                          value={cardData.cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="1234 5678 9012 3456"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          className="w-full px-4 py-3.5 pr-12 border border-[#d8ccc2] rounded-xl outline-none focus:border-[#b48b6a] transition"
                          required={paymentMethod === "card"}
                        />

                        <FaCreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b48b6a]" />

                      </div>

                    </div>

                    {/* EXPIRY + CVV */}

                    <div className="grid grid-cols-2 gap-4">

                      <div>

                        <label className="block text-sm font-medium text-[#2c2520] mb-2">
                          Expiry Date
                        </label>

                        <input
                          type="text"
                          name="expiry"
                          value={cardData.expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          className="w-full px-4 py-3.5 border border-[#d8ccc2] rounded-xl outline-none focus:border-[#b48b6a] transition"
                          required={paymentMethod === "card"}
                        />

                      </div>

                      <div>

                        <label className="block text-sm font-medium text-[#2c2520] mb-2">
                          CVV
                        </label>

                        <input
                          type="password"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCvvChange}
                          placeholder="123"
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          className="w-full px-4 py-3.5 border border-[#d8ccc2] rounded-xl outline-none focus:border-[#b48b6a] transition"
                          required={paymentMethod === "card"}
                        />

                      </div>

                    </div>

                    <div className="flex items-center gap-2 mt-5 text-xs text-[#6b5b4f]">

                      <FaLock className="text-[#b48b6a]" />

                      Your payment information is protected.

                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>

          {/* ======================================
              ORDER SUMMARY
          ====================================== */}

          <div>

            <div className="bg-white rounded-3xl p-6 md:p-7 shadow-sm lg:sticky lg:top-24">

              <h2 className="text-xl font-semibold text-[#2c2520] mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">

                {cartItems.map((item) => {

                  const image =
                    Array.isArray(item.images) &&
                    item.images.length > 0
                      ? item.images[0]
                      : item.image || "";

                  return (
                    <div
                      key={item.id}
                      className="flex gap-3"
                    >

                      <div className="w-16 h-16 rounded-xl bg-[#f3ede8] overflow-hidden flex-shrink-0">

                        {image ? (
                          <img
                            src={image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaShoppingBag className="text-[#b48b6a]" />
                          </div>
                        )}

                      </div>

                      <div className="flex-1 min-w-0">

                        <p className="font-medium text-[#2c2520] text-sm truncate">
                          {item.name}
                        </p>

                        <p className="text-xs text-[#6b5b4f] mt-1">
                          Qty: {item.quantity}
                        </p>

                        <p className="text-sm font-semibold text-[#2c2520] mt-1">
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

              {/* TOTALS */}

              <div className="border-t border-[#e6ddd5] pt-5 space-y-4">

                <div className="flex justify-between">

                  <span className="text-[#4d453e]">
                    Subtotal
                  </span>

                  <span className="font-medium text-[#2c2520]">
                    LKR {subtotal.toLocaleString()}
                  </span>

                </div>

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

                <div className="border-t border-[#e6ddd5] pt-5">

                  <div className="flex justify-between items-center">

                    <span className="text-lg font-semibold text-[#2c2520]">
                      Total
                    </span>

                    <span className="text-xl font-bold text-[#2c2520]">
                      LKR {total.toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>

              {/* PLACE ORDER */}

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-7 py-4 rounded-full font-medium text-white flex items-center justify-center gap-2 transition duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#b48b6a] hover:bg-[#967052]"
                }`}
              >

                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheck />

                    {paymentMethod === "card"
                      ? "Pay & Place Order"
                      : "Place Order"}
                  </>
                )}

              </button>

              <p className="text-center text-xs text-[#6b5b4f] mt-4">
                🔒 Your order information is secure.
              </p>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
};

export default Checkout;