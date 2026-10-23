import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaShoppingBag,
  FaDollarSign,
  FaEye,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

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
  // USER-SPECIFIC ORDERS KEY
  // ==========================================

  const getOrdersKey = () => {
    const userId = getUserId();

    if (!userId) return null;

    return `orders_${userId}`;
  };

  // ==========================================
  // LOAD CURRENT USER ORDERS
  // ==========================================

  useEffect(() => {
    const loadOrders = () => {
      // No user
      if (!user) {
        setOrders([]);
        return;
      }

      // Admin doesn't have customer orders
      if (
        user.role === 'admin' ||
        user.role === 'super_admin'
      ) {
        setOrders([]);
        return;
      }

      const ordersKey = getOrdersKey();

      if (!ordersKey) {
        setOrders([]);
        return;
      }

      try {
        const savedOrders = JSON.parse(
          localStorage.getItem(ordersKey) || '[]'
        );

        setOrders(
          Array.isArray(savedOrders)
            ? savedOrders
            : []
        );
      } catch (error) {
        console.error(
          'Error loading orders:',
          error
        );

        setOrders([]);
      }
    };

    loadOrders();

    window.addEventListener(
      'ordersUpdated',
      loadOrders
    );

    window.addEventListener(
      'storage',
      loadOrders
    );

    return () => {
      window.removeEventListener(
        'ordersUpdated',
        loadOrders
      );

      window.removeEventListener(
        'storage',
        loadOrders
      );
    };
  }, [user]);

  // ==========================================
  // STATUS COLOR
  // ==========================================

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700 border border-green-200';

      case 'Processing':
        return 'bg-blue-100 text-blue-700 border border-blue-200';

      case 'Shipped':
        return 'bg-purple-100 text-purple-700 border border-purple-200';

      case 'Cancelled':
        return 'bg-red-100 text-red-700 border border-red-200';

      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';

      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  // ==========================================
  // ITEM COUNT
  // ==========================================

  const getItemCount = (order) => {
    if (Array.isArray(order.items)) {
      return order.items.reduce(
        (total, item) =>
          total + Number(item.quantity || 1),
        0
      );
    }

    return Number(order.items || 0);
  };

  // ==========================================
  // ORDER DATE
  // ==========================================

  const getOrderDate = (order) => {
    if (order.createdAt) {
      return new Date(
        order.createdAt
      ).toLocaleDateString();
    }

    if (order.date) {
      return order.date;
    }

    return '-';
  };

  // ==========================================
  // ORDER TOTAL
  // ==========================================

  const getOrderTotal = (order) => {
    return Number(order.total || 0);
  };

  // ==========================================
  // TOTAL SPENT
  // ==========================================

  const totalSpent = orders.reduce(
    (sum, order) =>
      sum + getOrderTotal(order),
    0
  );

  // ==========================================
  // TOTAL PRODUCTS
  // ==========================================

  const totalProducts = orders.reduce(
    (sum, order) =>
      sum + getItemCount(order),
    0
  );

  // ==========================================
  // CURRENT YEAR
  // ==========================================

  const currentYear =
    orders.length > 0
      ? new Date(
          orders[0].createdAt ||
            orders[0].date ||
            new Date()
        ).getFullYear()
      : new Date().getFullYear();

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!user) {
    return (
      <div className="min-h-[600px] bg-[#fcf8f5] flex items-center justify-center px-6">
        <div className="text-center max-w-md">

          <div className="w-24 h-24 mx-auto rounded-full bg-[#f3ede8] flex items-center justify-center mb-6">
            <FaBoxOpen className="text-4xl text-[#b48b6a]" />
          </div>

          <h2 className="text-3xl font-light text-[#1e2b2b] mb-3">
            Please Login
          </h2>

          <p className="text-[#6b625c] mb-7">
            Please login to view your orders.
          </p>

          <button
            onClick={() => navigate('/user-login')}
            className="inline-flex items-center justify-center bg-[#1e2b2b] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#b48b6a] transition-all"
          >
            Login
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // ADMIN ACCOUNT
  // ==========================================

  if (
    user.role === 'admin' ||
    user.role === 'super_admin'
  ) {
    return (
      <div className="min-h-[600px] bg-[#fcf8f5] flex items-center justify-center px-6">
        <div className="text-center max-w-md">

          <div className="w-24 h-24 mx-auto rounded-full bg-[#f3ede8] flex items-center justify-center mb-6">
            <FaBoxOpen className="text-4xl text-[#b48b6a]" />
          </div>

          <h2 className="text-3xl font-light text-[#1e2b2b] mb-3">
            Admin Account
          </h2>

          <p className="text-[#6b625c] mb-7">
            Customer order history is not available for admin accounts.
          </p>

          <Link
            to="/admin"
            className="inline-flex items-center justify-center bg-[#1e2b2b] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#b48b6a] transition-all"
          >
            Admin Dashboard
          </Link>

        </div>
      </div>
    );
  }

  // ==========================================
  // NO ORDERS
  // ==========================================

  if (orders.length === 0) {
    return (
      <div className="min-h-[600px] bg-[#fcf8f5] flex items-center justify-center px-6">
        <div className="text-center max-w-md">

          <div className="w-24 h-24 mx-auto rounded-full bg-[#f3ede8] flex items-center justify-center mb-6">
            <FaBoxOpen className="text-4xl text-[#b48b6a]" />
          </div>

          <h2 className="text-3xl font-light text-[#1e2b2b] mb-3">
            No Orders Yet
          </h2>

          <p className="text-[#6b625c] mb-7">
            You haven't placed any orders yet. Start shopping and your orders
            will appear here.
          </p>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center bg-[#1e2b2b] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#b48b6a] transition-all"
          >
            Start Shopping
          </Link>

        </div>
      </div>
    );
  }

  // ==========================================
  // ORDERS PAGE
  // ==========================================

  return (
    <div className="min-h-[600px] bg-[#fcf8f5]">

      {/* ======================================
          HEADER
      ====================================== */}

      <section className="bg-[#1e2b2b] text-white py-14">

        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          <p className="text-[#d4b68a] text-xs tracking-[0.25em] font-semibold mb-3">
            LUMIÈRE ACCOUNT
          </p>

          <h1 className="text-4xl md:text-5xl font-light">
            My <span className="font-semibold">Orders</span>
          </h1>

          <p className="text-white/60 mt-3">
            Track and view your Lumière skincare orders.
          </p>

        </div>

      </section>

      {/* ======================================
          ORDERS
      ====================================== */}

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14">

        {/* ====================================
            SUMMARY CARDS
        ==================================== */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

          {/* TOTAL ORDERS */}

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#eee3dc]">

            <div className="w-11 h-11 rounded-2xl bg-[#f3ede8] flex items-center justify-center mb-4">
              <FaBoxOpen className="text-[#b48b6a]" />
            </div>

            <p className="text-2xl font-semibold text-[#1e2b2b]">
              {orders.length}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Total Orders
            </p>

          </div>

          {/* PRODUCTS ORDERED */}

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#eee3dc]">

            <div className="w-11 h-11 rounded-2xl bg-[#f3ede8] flex items-center justify-center mb-4">
              <FaShoppingBag className="text-[#b48b6a]" />
            </div>

            <p className="text-2xl font-semibold text-[#1e2b2b]">
              {totalProducts}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Products Ordered
            </p>

          </div>

          {/* TOTAL SPENT */}

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#eee3dc]">

            <div className="w-11 h-11 rounded-2xl bg-[#f3ede8] flex items-center justify-center mb-4">
              <FaDollarSign className="text-[#b48b6a]" />
            </div>

            <p className="text-2xl font-semibold text-[#1e2b2b]">
              LKR {totalSpent.toLocaleString()}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Total Spent
            </p>

          </div>

          {/* ORDER YEAR */}

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#eee3dc]">

            <div className="w-11 h-11 rounded-2xl bg-[#f3ede8] flex items-center justify-center mb-4">
              <FaCalendarAlt className="text-[#b48b6a]" />
            </div>

            <p className="text-2xl font-semibold text-[#1e2b2b]">
              {currentYear}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Order Year
            </p>

          </div>

        </div>

        {/* ====================================
            DESKTOP / TABLET TABLE
        ==================================== */}

        <div className="hidden md:block bg-white rounded-[30px] shadow-sm border border-[#eee3dc] overflow-hidden">

          <div className="px-7 py-6 border-b border-[#eee3dc] flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-semibold text-[#1e2b2b]">
                Order History
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                View your recent purchases
              </p>

            </div>

            <Link
              to="/shop"
              className="text-[#b48b6a] text-sm font-semibold hover:underline"
            >
              Continue Shopping
            </Link>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-[#f3ede8]">

                <tr>

                  <th className="px-7 py-4 text-left text-xs uppercase tracking-wider">
                    Order
                  </th>

                  <th className="px-7 py-4 text-left text-xs uppercase tracking-wider">
                    Date
                  </th>

                  <th className="px-7 py-4 text-left text-xs uppercase tracking-wider">
                    Items
                  </th>

                  <th className="px-7 py-4 text-left text-xs uppercase tracking-wider">
                    Total
                  </th>

                  <th className="px-7 py-4 text-left text-xs uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-7 py-4 text-left text-xs uppercase tracking-wider">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr
                    key={order.id}
                    className="border-b border-[#eee3dc] last:border-none hover:bg-[#fcf8f5] transition"
                  >

                    {/* ORDER */}

                    <td className="px-7 py-6">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-[#f3ede8] flex items-center justify-center">

                          <FaBoxOpen className="text-[#b48b6a]" />

                        </div>

                        <div>

                          <p className="font-semibold text-[#1e2b2b]">
                            {order.id}
                          </p>

                          <p className="text-xs text-gray-500">
                            Lumière Skincare
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* DATE */}

                    <td className="px-7 py-6 text-sm text-gray-600">
                      {getOrderDate(order)}
                    </td>

                    {/* ITEMS */}

                    <td className="px-7 py-6 text-sm text-gray-600">

                      {getItemCount(order)}{' '}

                      {getItemCount(order) === 1
                        ? 'item'
                        : 'items'}

                    </td>

                    {/* TOTAL */}

                    <td className="px-7 py-6 font-semibold text-[#1e2b2b]">
                      LKR {getOrderTotal(order).toLocaleString()}
                    </td>

                    {/* STATUS */}

                    <td className="px-7 py-6">

                      <span
                        className={`inline-flex px-4 py-2 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status || 'Pending'
                        )}`}
                      >
                        {order.status || 'Pending'}
                      </span>

                    </td>

                    {/* ACTION */}

                    <td className="px-7 py-6">

                      <Link
                        to={`/orders/${order.id}`}
                        className="inline-flex items-center gap-2 text-[#b48b6a] font-semibold text-sm hover:text-[#1e2b2b] transition"
                      >
                        <FaEye />
                        View Details
                      </Link>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* ====================================
            MOBILE CARDS
        ==================================== */}

        <div className="md:hidden space-y-4">

          <div className="mb-6">

            <h2 className="text-2xl font-semibold text-[#1e2b2b]">
              Order History
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View your recent purchases
            </p>

          </div>

          {orders.map((order) => (

            <div
              key={order.id}
              className="bg-white rounded-3xl p-5 border border-[#eee3dc] shadow-sm"
            >

              <div className="flex justify-between items-start">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-[#f3ede8] flex items-center justify-center">

                    <FaBoxOpen className="text-[#b48b6a]" />

                  </div>

                  <div>

                    <h3 className="font-semibold">
                      {order.id}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {getOrderDate(order)}
                    </p>

                  </div>

                </div>

                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(
                    order.status || 'Pending'
                  )}`}
                >
                  {order.status || 'Pending'}
                </span>

              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-[#eee3dc]">

                <div>

                  <p className="text-xs text-gray-400">
                    Items
                  </p>

                  <p className="font-semibold mt-1">
                    {getItemCount(order)}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-gray-400">
                    Total
                  </p>

                  <p className="font-semibold mt-1">
                    LKR {getOrderTotal(order).toLocaleString()}
                  </p>

                </div>

              </div>

              <Link
                to={`/orders/${order.id}`}
                className="mt-5 w-full bg-[#1e2b2b] text-white py-3 rounded-full flex items-center justify-center gap-2 text-sm font-semibold hover:bg-[#b48b6a] transition"
              >
                <FaEye />
                View Details
              </Link>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
};

export default Orders;