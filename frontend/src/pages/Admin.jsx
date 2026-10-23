import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  FaUsers,
  FaBox,
  FaShoppingBag,
  FaDollarSign,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaComments,
  FaReply,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Admin = () => {
  
const formatLKR = (amount) =>
  `LKR ${Number(amount || 0).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const [activeTab, setActiveTab] = useState('dashboard');

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [questions, setQuestions] = useState([]);
const [questionReplies, setQuestionReplies] = useState({});
const [questionsLoading, setQuestionsLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'serum',
    stock: '',
    rating: '4.8',
    reviewsCount: '0',
    description: '',
    benefits: '',
    ingredients: '',
    howToUse: '',
    image: '',
  });

  
  /* =====================================================
     LOAD PRODUCTS
  ===================================================== */

  
/* =====================================================
   LOAD PRODUCTS FROM MONGODB
===================================================== */

useEffect(() => {
  const loadProducts = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/products'
      );

      const dbProducts = (
        response.data.products || []
      ).map((product) => ({
        ...product,
        id: product._id,
        image:
          product.images?.[0] ||
          product.image ||
          '',
        isAdminProduct: true,
      }));

      setProducts(dbProducts);
    } catch (error) {
      console.error(
        'Load products error:',
        error.response?.data || error
      );

      toast.error('Could not load products from database.');
      setProducts([]);
    }
  };

  const loadOrders = () => {
    try {
      const savedOrders = JSON.parse(
        localStorage.getItem('orders') || '[]'
      );

      setOrders(savedOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    }
  };

  loadProducts();
  loadOrders();

  window.addEventListener('ordersUpdated', loadOrders);

  return () => {
    window.removeEventListener('ordersUpdated', loadOrders);
  };
}, []);

  /* =====================================================
     SAVE PRODUCTS
  ===================================================== */

  const saveProducts = (updatedProducts) => {
    setProducts(updatedProducts);

    /*
      Only admin-added products are stored.
      Default products remain built-in.
    */

    const customProducts = updatedProducts.filter(
      (product) => product.isAdminProduct
    );

    localStorage.setItem(
      'products',
      JSON.stringify(customProducts)
    );
  };

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     OPEN ADD FORM
  ===================================================== */

  const handleAddProduct = () => {
    setEditingProduct(null);

    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: 'serum',
      stock: '',
      rating: '4.8',
      reviewsCount: '0',
      description: '',
      benefits: '',
      ingredients: '',
      howToUse: '',
      image: '',
    });

    setShowProductForm(true);
  };

  /* =====================================================
     EDIT PRODUCT
  ===================================================== */

  const handleEditProduct = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      category: product.category || 'serum',
      stock: product.stock || '',
      rating: product.rating || '4.8',
      reviewsCount: product.reviewsCount || '0',
      description: product.description || '',
      benefits: Array.isArray(product.benefits)
        ? product.benefits.join(', ')
        : product.benefits || '',
      ingredients: Array.isArray(product.ingredients)
        ? product.ingredients.join(', ')
        : product.ingredients || '',
      howToUse: product.howToUse || '',
      image: product.image || '',
    });

    setShowProductForm(true);
  };

  /* =====================================================
     DELETE PRODUCT
  ===================================================== */

   
const handleDeleteProduct = async (id) => {
  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  if (!product?.isAdminProduct || !product?._id) {
    toast.error(
      'This product is not stored in the database.'
    );
    return;
  }

  if (!window.confirm(`Delete "${product.name}"?`)) {
    return;
  }

  const token = localStorage.getItem('token');

  try {
    await axios.delete(
      `http://localhost:5000/api/admin/products/${product._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProducts((prev) =>
      prev.filter(
        (item) => String(item._id) !== String(product._id)
      )
    );

    toast.success('Product deleted successfully');
  } catch (error) {
    console.error(
      'Delete product error:',
      error.response?.data || error
    );

    toast.error(
      error.response?.data?.message ||
        'Could not delete product.'
    );
  }
};


  /* =====================================================
     SUBMIT PRODUCT
  ===================================================== */

   
const handleSubmitProduct = async (e) => {
  e.preventDefault();

  if (!formData.name.trim()) {
    toast.error('Please enter product name');
    return;
  }

  if (!formData.price || !formData.stock) {
    toast.error('Please enter product price and stock');
    return;
  }

  const token = localStorage.getItem('token');

  if (!token) {
    toast.error('Please login as admin again.');
    return;
  }

  const productData = {
    name: formData.name.trim(),
    price: Number(formData.price),
    originalPrice: formData.originalPrice
      ? Number(formData.originalPrice)
      : undefined,
    category: formData.category,
    stock: Number(formData.stock),
    rating: Number(formData.rating) || 4.8,
    reviewsCount: Number(formData.reviewsCount) || 0,
    description:
      formData.description ||
      'Premium skincare product from Lumière.',
    benefits: formData.benefits
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    ingredients: formData.ingredients
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    howToUse:
      formData.howToUse ||
      'Use as directed as part of your skincare routine.',
    images: [
      formData.image ||
        'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=85',
    ],
  };

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let response;

    if (editingProduct?._id) {
      response = await axios.put(
        `http://localhost:5000/api/admin/products/${editingProduct._id}`,
        productData,
        config
      );
    } else {
      response = await axios.post(
        'http://localhost:5000/api/admin/products',
        productData,
        config
      );
    }

    if (response.data.success) {
      const result = await axios.get(
        'http://localhost:5000/api/products'
      );

      const dbProducts = result.data.products.map((product) => ({
        ...product,
        id: product._id,
        image: product.images?.[0] || '',
        isAdminProduct: true,
      }));

      setProducts(dbProducts);

      setShowProductForm(false);
      setEditingProduct(null);

      toast.success(
        editingProduct
          ? 'Product updated successfully!'
          : 'Product added successfully!'
      );
    }
  } catch (error) {
    console.error(
      'Product save error:',
      error.response?.data || error
    );

    toast.error(
      error.response?.data?.message ||
        'Could not save product. Please check the backend.'
    );
  }
};
  /* =====================================================
     PRODUCT QUESTIONS & ANSWERS
  ===================================================== */

const loadQuestions = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    toast.error('Please login as admin again.');
    return;
  }

  setQuestionsLoading(true);

  try {
    const response = await axios.get(
      'http://localhost:5000/api/product-questions/admin/all',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Admin questions API response:', response.data);

    const data = response.data?.questions;

    if (Array.isArray(data)) {
      setQuestions(data);

      if (data.length === 0) {
        toast('No customer questions found.');
      }
    } else {
      setQuestions([]);
      console.error('Questions array missing in API response.');
      toast.error('Unexpected response from server.');
    }
  } catch (error) {
    console.error(
      'Load questions error:',
      error.response?.status,
      error.response?.data || error.message
    );

    toast.error(
      error.response?.data?.message ||
      'Could not load customer questions.'
    );
  } finally {
    setQuestionsLoading(false);
  }
};

const handleReplyQuestion = async (questionId) => {
  const token = localStorage.getItem('token');
  const answer = questionReplies[questionId]?.trim();

  if (!token) {
    toast.error('Please login as admin again.');
    return;
  }

  if (!answer) {
    toast.error('Please write a reply first.');
    return;
  }

  try {
    await axios.put(
      `http://localhost:5000/api/product-questions/admin/${questionId}/answer`,
      { answer },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success('Reply saved successfully!');

    setQuestionReplies((prev) => ({
      ...prev,
      [questionId]: '',
    }));

    await loadQuestions();
  } catch (error) {
    console.error(
      'Reply error:',
      error.response?.status,
      error.response?.data || error.message
    );

    toast.error(
      error.response?.data?.message ||
        'Could not send reply.'
    );
  }
};

  /* =====================================================
     STATUS COLOR
  ===================================================== */

  const getStatus = (stock) => {
    if (stock <= 0) {
      return {
        text: 'Out of Stock',
        className: 'text-red-600',
      };
    }

    if (stock <= 10) {
      return {
        text: 'Low Stock',
        className: 'text-yellow-600',
      };
    }

    return {
      text: 'In Stock',

      className: 'text-green-600',
    };
  };

  /* =====================================================
     STATS
  ===================================================== */

  const stats = [
    {
      icon: FaUsers,
      label: 'Total Users',
      value: '1,234',
      color: 'text-blue-600',
    },

    {
      icon: FaBox,
      label: 'Total Products',
      value: products.length,
      color: 'text-purple-600',
    },

    {
      icon: FaShoppingBag,
      label: 'Total Orders',
      value: orders.length,
      color: 'text-green-600',
    },

    {
      icon: FaDollarSign,
      label: 'Revenue',
      value: 'LKR 45,678.00',
      color: 'text-yellow-600',
    },
  ];

  /* =====================================================
     RECENT ORDERS
  ===================================================== */

  
      
  /* =====================================================
     CONTENT
  ===================================================== */

  const renderContent = () => {
    switch (activeTab) {

      /* ================= DASHBOARD ================= */

      case 'dashboard':
        return (
          <div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center gap-4">

                    <div
                      className={`${stat.color} bg-[#f3ede8] p-3 rounded-xl`}
                    >
                      <stat.icon className="text-2xl" />
                    </div>

                    <div>
                      <p className="text-sm text-[#4d453e]">
                        {stat.label}
                      </p>

                      <p className="text-2xl font-bold">
                        {stat.value}
                      </p>
                    </div>

                  </div>
                </div>
              ))}

            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">

              <h3 className="text-xl font-semibold mb-4">
                Recent Orders
              </h3>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>
                    <tr className="border-b border-[#e6ddd5]">

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Order ID
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Customer
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Total
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Status
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Date
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Action
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-[#e6ddd5]"
                      >

                        <td className="px-4 py-3 font-medium">
                          {order.id}
                        </td>

                        <td className="px-4 py-3">
                          {order.customer?.fullName || 'Unknown Customer'}
                        </td>

                        <td className="px-4 py-3">
                          LKR {Number(order.total || 0).toLocaleString()}
                        </td>

                        <td className="px-4 py-3">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'Delivered'
                                ? 'bg-green-100 text-green-600'
                                : order.status === 'Processing'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-purple-100 text-purple-600'
                            }`}
                          >
                            {order.status}
                          </span>

                        </td>

                        <td className="px-4 py-3 text-[#4d453e]">
                          {order.createdAt
  ? new Date(order.createdAt).toLocaleDateString()
  : '-'}
                        </td>

                        <td className="px-4 py-3">

                          <button className="text-[#b48b6a] hover:text-[#1e2b2b]">
                            <FaEye />
                          </button>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </div>
        );

      /* ================= PRODUCTS ================= */

      case 'products':
        return (
          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center mb-6">

              <div>
                <h3 className="text-xl font-semibold">
                  Products
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Manage your skincare products
                </p>
              </div>

              <button
                onClick={handleAddProduct}
                className="flex items-center gap-2 bg-[#1e2b2b] text-white px-5 py-3 rounded-full font-semibold hover:bg-[#b48b6a] hover:text-[#1e2b2b] transition"
              >
                <FaPlus />
                Add Product
              </button>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-[#e6ddd5]">

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Product
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Category
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Price
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Stock
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {products.map((product) => {

                    const status = getStatus(
                      Number(product.stock)
                    );

                    return (
                      <tr
                        key={product.id}
                        className="border-b border-[#e6ddd5] last:border-0"
                      >

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-3">

                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover bg-[#f3ede8]"
                            />

                            <div>

                              <p className="font-medium">
                                {product.name}
                              </p>

                              <p className="text-xs text-gray-500">
                                ID: {product.id}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-4 py-4 capitalize">
                          {product.category}
                        </td>

                        <td className="px-4 py-4 font-semibold">
  {formatLKR(product.price)}
</td>

                        <td className="px-4 py-4">
                          {product.stock}
                        </td>

                        <td className="px-4 py-4">

                          <span className={status.className}>
                            {status.text}
                          </span>

                        </td>

                        <td className="px-4 py-4">

                          <div className="flex gap-3">

                            <Link
                              to={`/product/${product.id}`}
                              className="text-[#b48b6a] hover:text-[#1e2b2b]"
                              title="View Product"
                            >
                              <FaEye />
                            </Link>

                            <button
                              onClick={() =>
                                handleEditProduct(product)
                              }
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit Product"
                            >
                              <FaEdit />
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteProduct(product.id)
                              }
                              className="text-red-600 hover:text-red-800"
                              title="Delete Product"
                            >
                              <FaTrash />
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>
        );

      /* ================= USERS ================= */

      case 'users':
        return (
          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h3 className="text-xl font-semibold mb-4">
              Users
            </h3>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-[#e6ddd5]">

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Name
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Email
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Role
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Status
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  <tr className="border-b border-[#e6ddd5]">

                    <td className="px-4 py-3">
                      John Doe
                    </td>

                    <td className="px-4 py-3">
                      john@email.com
                    </td>

                    <td className="px-4 py-3">
                      Admin
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-green-600">
                        Active
                      </span>
                    </td>

                    <td className="px-4 py-3">

                      <div className="flex gap-2">

                        <button className="text-blue-600">
                          <FaEdit />
                        </button>

                        <button className="text-red-600">
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>

                  <tr>

                    <td className="px-4 py-3">
                      Jane Smith
                    </td>

                    <td className="px-4 py-3">
                      jane@email.com
                    </td>

                    <td className="px-4 py-3">
                      User
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-green-600">
                        Active
                      </span>
                    </td>

                    <td className="px-4 py-3">

                      <div className="flex gap-2">

                        <button className="text-blue-600">
                          <FaEdit />
                        </button>

                        <button className="text-red-600">
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>
        );

      /* ================= ORDERS ================= */

      case 'orders':
        return (
          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <h3 className="text-xl font-semibold mb-6">
              Orders
            </h3>

            <div className="grid md:grid-cols-3 gap-5">

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-[#e6ddd5] rounded-2xl p-5"
                >

                  <div className="flex justify-between">

                    <div>
                      <p className="font-semibold">
                        {order.id}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.customer}
                      </p>
                    </div>

                    <FaShoppingBag className="text-[#b48b6a]" />

                  </div>

                  <p className="text-xl font-bold mt-4">
  {formatLKR(order.total)}
</p>

                  <p className="text-sm text-gray-500 mt-2">
                    {order.date}
                  </p>

                  <span className="inline-block mt-4 px-3 py-1 rounded-full bg-[#f3ede8] text-sm">
                    {order.status}
                  </span>

                </div>
              ))}

            </div>

          </div>
        );
              /* ================= PRODUCT QUESTIONS ================= */

      case 'questions':
        return (
          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">
                  Product Questions & Answers
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  View customer questions and reply privately.
                </p>
              </div>

              <button
                onClick={loadQuestions}
                className="rounded-full bg-[#1e2b2b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b48b6a]"
              >
                Refresh Questions
              </button>
            </div>

            {questionsLoading ? (
              <p className="py-10 text-center text-gray-500">
                Loading questions...
              </p>
            ) : questions.length === 0 ? (
              <div className="rounded-2xl bg-[#fcf8f5] px-5 py-12 text-center">
                <FaComments className="mx-auto mb-4 text-4xl text-[#b48b6a]" />

                <h4 className="font-semibold text-[#1e2b2b]">
                  No Questions Yet
                </h4>

                <p className="mt-2 text-sm text-gray-500">
                  Customer questions will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {questions.map((item) => (
                  <article
                    key={item._id}
                    className="rounded-2xl border border-[#e6ddd5] p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#b48b6a]">
                          Product
                        </p>

                        <h4 className="mt-1 font-semibold text-[#1e2b2b]">
                          {item.product?.name || 'Product'}
                        </h4>

                        <p className="mt-2 text-sm text-gray-500">
                          Customer: {item.user?.name || item.user?.email || 'Customer'}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleString()
                            : ''}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === 'answered'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {item.status === 'answered'
                          ? 'Answered'
                          : 'Pending'}
                      </span>
                    </div>

                    <div className="mt-5 rounded-xl bg-[#fcf8f5] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Customer Question
                      </p>

                      <p className="mt-2 whitespace-pre-wrap leading-7 text-[#263333]">
                        {item.question}
                      </p>
                    </div>

                    {item.answer && (
                      <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-700">
                          <FaReply />
                          Your Reply
                        </p>

                        <p className="mt-2 whitespace-pre-wrap leading-7 text-gray-700">
                          {item.answer}
                        </p>
                      </div>
                    )}

                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-semibold">
                        {item.answer ? 'Update Reply' : 'Write a Reply'}
                      </label>

                      <textarea
                        value={questionReplies[item._id] ?? item.answer ?? ''}
                        onChange={(event) =>
                          setQuestionReplies((prev) => ({
                            ...prev,
                            [item._id]: event.target.value,
                          }))
                        }
                        rows={3}
                        maxLength={3000}
                        placeholder="Write your answer to the customer..."
                        className="w-full resize-y rounded-xl border border-[#e6ddd5] px-4 py-3 outline-none transition focus:border-[#b48b6a]"
                      />

                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => handleReplyQuestion(item._id)}
                          className="inline-flex items-center gap-2 rounded-full bg-[#1e2b2b] px-6 py-3 font-semibold text-white transition hover:bg-[#b48b6a] hover:text-[#1e2b2b]"
                        >
                          <FaReply />
                          {item.answer ? 'Update Reply' : 'Send Reply'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="container-custom py-12">

      <h2 className="text-3xl font-light mb-8">
        Admin <span className="font-semibold text-[#b48b6a]">
          Dashboard
        </span>
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* ================= SIDEBAR ================= */}

        <div className="lg:w-64">

          <div className="bg-white rounded-3xl p-4 shadow-sm">

            <div className="space-y-2">

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left px-4 py-3 rounded-xl transition ${
                  activeTab === 'dashboard'
                    ? 'bg-[#1e2b2b] text-white'
                    : 'hover:bg-[#f3ede8]'
                }`}
              >
                📊 Dashboard
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`w-full text-left px-4 py-3 rounded-xl transition ${
                  activeTab === 'products'
                    ? 'bg-[#1e2b2b] text-white'
                    : 'hover:bg-[#f3ede8]'
                }`}
              >
                📦 Products
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`w-full text-left px-4 py-3 rounded-xl transition ${
                  activeTab === 'users'
                    ? 'bg-[#1e2b2b] text-white'
                    : 'hover:bg-[#f3ede8]'
                }`}
              >
                👤 Users
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-xl transition ${
                  activeTab === 'orders'
                    ? 'bg-[#1e2b2b] text-white'
                    : 'hover:bg-[#f3ede8]'
                }`}
              >
                🛒 Orders
              </button>
                              <button
                onClick={() => {
                  setActiveTab('questions');
                  loadQuestions();
                }}
                className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl transition ${
                  activeTab === 'questions'
                    ? 'bg-[#1e2b2b] text-white'
                    : 'hover:bg-[#f3ede8]'
                }`}
              >
                <FaComments />
                Product Questions
              </button>
            </div>

          </div>

        </div>

        {/* ================= CONTENT ================= */}

        <div className="flex-1">
          {renderContent()}
        </div>

      </div>

      {/* =================================================
          ADD / EDIT PRODUCT MODAL
      ================================================= */}

      {showProductForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* Modal Header */}

            <div className="sticky top-0 bg-white border-b border-[#e6ddd5] px-6 py-5 flex justify-between items-center z-10">

              <div>

                <h3 className="text-2xl font-semibold">
                  {editingProduct
                    ? 'Edit Product'
                    : 'Add New Product'}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {editingProduct
                    ? 'Update product information'
                    : 'Add a new skincare product to your shop'}
                </p>

              </div>

              <button
                onClick={() => setShowProductForm(false)}
                className="w-10 h-10 rounded-full hover:bg-[#f3ede8] flex items-center justify-center"
              >
                <FaTimes />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmitProduct}
              className="p-6 space-y-6"
            >

              {/* Product Name */}

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Hydrating Face Serum"
                  className="w-full px-4 py-3 rounded-xl border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
                />

              </div>

              {/* Price */}

              <div className="grid md:grid-cols-3 gap-4">

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Price *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="46"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Original Price
                  </label>

                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="58"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Stock *
                  </label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="50"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
                  />

                </div>

              </div>

              {/* Category */}

              <div className="grid md:grid-cols-3 gap-4">

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
                  >

                    <option value="cleanser">
                      Cleanser
                    </option>

                    <option value="moisturizer">
                      Moisturizer
                    </option>

                    <option value="serum">
                      Serum
                    </option>

                    <option value="sunscreen">
                      Sunscreen
                    </option>

                    <option value="mask">
                      Mask
                    </option>

                    <option value="beauty-tools">
                      Beauty Tools
                    </option>

                  </select>

                </div>

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Rating
                  </label>

                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-4 py-3 rounded-xl border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Reviews
                  </label>

                  <input
                    type="number"
                    name="reviewsCount"
                    value={formData.reviewsCount}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 rounded-xl border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
                  />

                </div>

              </div>

              {/* Image */}

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Product Image URL
                </label>

                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/product-image.jpg"
                  className="w-full px-4 py-3 rounded-xl border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
                />

                <p className="text-xs text-gray-500 mt-2">
                  Paste an image URL. If empty, a default skincare image will be used.
                </p>

              </div>

              {/* Description */}

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Describe the product..."
                  className="w-full px-4 py-3 rounded-xl border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a] resize-none"
                />

              </div>

              {/* Benefits */}

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Benefits
                </label>

                <input
                  type="text"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder="Brightens skin, Hydrates skin, Reduces dark spots"
                  className="w-full px-4 py-3 rounded-xl border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
                />

                <p className="text-xs text-gray-500 mt-2">
                  Separate each benefit with a comma.
                </p>

              </div>

              {/* Ingredients */}

              <div>

                <label className="block text-sm font-semibold mb-2">
                  Ingredients
                </label>

                <input
                  type="text"
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleChange}
                  placeholder="Vitamin C, Hyaluronic Acid, Vitamin E"
                  className="w-full px-4 py-3 rounded-xl border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a]"
                />

                <p className="text-xs text-gray-500 mt-2">
                  Separate ingredients with commas.
                </p>

              </div>

              {/* How To Use */}

              <div>

                <label className="block text-sm font-semibold mb-2">
                  How to Use
                </label>

                <textarea
                  name="howToUse"
                  value={formData.howToUse}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Explain how customers should use this product..."
                  className="w-full px-4 py-3 rounded-xl border border-[#e6ddd5] focus:outline-none focus:border-[#b48b6a] resize-none"
                />

              </div>

              {/* Buttons */}

              <div className="flex flex-col sm:flex-row gap-3 pt-3">

                <button
                  type="submit"
                  className="flex-1 bg-[#1e2b2b] text-white py-3 rounded-full font-semibold hover:bg-[#b48b6a] hover:text-[#1e2b2b] transition"
                >
                  {editingProduct
                    ? 'Update Product'
                    : 'Add Product'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="px-8 py-3 rounded-full border border-[#e6ddd5] hover:bg-[#f3ede8] transition"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Admin;