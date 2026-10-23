
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaUserCircle,
  FaEnvelope,
  FaComments,
  FaArrowRight,
  FaSignOutAlt,
  FaLeaf,
  FaSyncAlt,
  FaClock,
  FaCheckCircle,
  FaBoxOpen,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';

const API_URL = 'http://localhost:5000/api';

const MyAccount = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const token =
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken');

      if (!token) {
        setError('Please log in again to view your questions.');
        setQuestions([]);
        return;
      }

      const response = await axios.get(
        `${API_URL}/product-questions/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setQuestions(response.data.questions || []);
      } else {
        setQuestions([]);
        setError('Unable to load your questions.');
      }
    } catch (err) {
      console.error('Load product questions error:', err);

      setError(
        err.response?.data?.message ||
        'Could not load your questions. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (date) => {
    if (!date) return 'Date unavailable';

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Date unavailable';
    }

    return parsedDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getProductName = (question) => {
    if (question.product && typeof question.product === 'object') {
      return question.product.name || 'Product';
    }

    return 'Product';
  };

  const getProductImage = (question) => {
    const product = question.product;

    if (!product || typeof product !== 'object') {
      return '';
    }

    if (product.image) return product.image;

    if (Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];

      return typeof firstImage === 'string'
        ? firstImage
        : firstImage?.url || firstImage?.image || '';
    }

    return '';
  };

  return (
    <div className="min-h-screen bg-[#fcf8f5]">
      {/* HERO */}
      <section
        className="relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=2000&q=85')",
        }}
      >
        <div className="absolute inset-0 bg-[#1e2b2b]/70" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-[#e2c49c]">
            <FaLeaf />
            Lumière Skincare
          </p>

          <h1 className="text-4xl font-light leading-tight text-white md:text-6xl">
            My Account
            <span className="mt-2 block font-serif italic text-[#e2c49c]">
              Your personal skincare space.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 md:text-base">
            Manage your profile and see your product questions
            and answers from our team in one place.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.5fr]">

          {/* PROFILE */}
          <section className="h-fit overflow-hidden rounded-2xl border border-[#e9dfd5] bg-white shadow-sm">
            <div className="h-2 bg-gradient-to-r from-[#1e2b2b] via-[#b48b6a] to-[#e2c49c]" />

            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f5ede4] text-4xl text-[#b48b6a]">
                  <FaUserCircle />
                </div>

                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#b48b6a]">
                    Welcome back
                  </p>

                  <h2 className="mt-1 break-words text-xl font-medium text-[#1e2b2b]">
                    {user?.name || 'Skincare Lover'}
                  </h2>
                </div>
              </div>

              <div className="my-7 h-px bg-[#eee5dc]" />

              <h3 className="text-lg font-medium text-[#1e2b2b]">
                My Profile
              </h3>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3">
                  <FaUserCircle className="mt-1 text-[#b48b6a]" />

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Full Name
                    </p>

                    <p className="mt-1 break-words text-sm text-[#1e2b2b]">
                      {user?.name || 'Not available'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaEnvelope className="mt-1 text-[#b48b6a]" />

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      Email Address
                    </p>

                    <p className="mt-1 break-all text-sm text-[#1e2b2b]">
                      {user?.email || 'Not available'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-[#1e2b2b] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#b48b6a]"
              >
                <FaBoxOpen />
                Explore Products
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-3 rounded-full border border-[#b48b6a] px-5 py-3 text-sm font-medium text-[#8d674d] transition hover:bg-[#1e2b2b] hover:text-white hover:border-[#1e2b2b]"
              >
                <FaSignOutAlt />
                Sign Out
              </button>
            </div>
          </section>

          {/* QUESTIONS AND REPLIES */}
          <section className="overflow-hidden rounded-2xl border border-[#e9dfd5] bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1e2b2b] px-6 py-6 md:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl text-[#e2c49c]">
                  <FaComments />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#e2c49c]">
                    Customer support
                  </p>

                  <h2 className="mt-1 text-xl font-medium text-white md:text-2xl">
                    My Product Questions
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={loadQuestions}
                disabled={loading}
                aria-label="Refresh questions"
                className="flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                <FaSyncAlt className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            <div className="p-5 md:p-8">
              <p className="mb-6 text-sm leading-7 text-gray-500">
                All the questions you have asked about our products
                and replies from our team appear here.
              </p>

              {/* LOADING */}
              {loading && (
                <div className="flex flex-col items-center py-12 text-[#b48b6a]">
                  <FaSyncAlt className="animate-spin text-3xl" />

                  <p className="mt-4 text-sm text-gray-500">
                    Loading your questions...
                  </p>
                </div>
              )}

              {/* ERROR */}
              {!loading && error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                  <p className="text-sm leading-6 text-red-700">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={loadQuestions}
                    className="mt-4 rounded-full bg-[#1e2b2b] px-5 py-2 text-sm text-white transition hover:bg-[#b48b6a]"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* EMPTY STATE */}
              {!loading && !error && questions.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#d9c5b1] bg-[#fcf8f5] px-5 py-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-[#b48b6a] shadow-sm">
                    <FaComments />
                  </div>

                  <h3 className="mt-5 text-lg font-medium text-[#1e2b2b]">
                    No questions yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    When you ask a question on a product page,
                    it will appear here with the reply from our team.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate('/shop')}
                    className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#b48b6a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1e2b2b]"
                  >
                    Browse Products
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              )}

              {/* QUESTION LIST */}
              {!loading && !error && questions.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Your conversations
                    </p>

                    <span className="rounded-full bg-[#f5ede4] px-3 py-1 text-xs font-medium text-[#8d674d]">
                      {questions.length}{' '}
                      {questions.length === 1 ? 'Question' : 'Questions'}
                    </span>
                  </div>

                  {questions.map((item) => {
                    const answer =
                      typeof item.answer === 'string'
                        ? item.answer.trim()
                        : '';

                    const answered =
                      item.status === 'answered' && answer.length > 0;

                    const image = getProductImage(item);

                    return (
                      <article
                        key={item._id}
                        className="overflow-hidden rounded-2xl border border-[#e9dfd5] bg-white transition hover:shadow-md"
                      >
                        {/* PRODUCT HEADER */}
                        <div className="flex items-center gap-4 bg-[#fcf8f5] p-4 md:p-5">
                          {image ? (
                            <img
                              src={image}
                              alt={getProductName(item)}
                              className="h-16 w-16 shrink-0 rounded-xl border border-[#e9dfd5] bg-white object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white text-2xl text-[#b48b6a]">
                              <FaBoxOpen />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <h3 className="break-words font-medium text-[#1e2b2b]">
                              {getProductName(item)}
                            </h3>

                            <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                              <FaClock />
                              Asked on {formatDate(item.createdAt)}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                              answered
                                ? 'bg-green-50 text-green-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {answered ? 'Answered' : 'Pending'}
                          </span>
                        </div>

                        <div className="space-y-5 p-4 md:p-6">
                          {/* CUSTOMER QUESTION */}
                          <div>
                            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#b48b6a]">
                              <FaComments />
                              Your Question
                            </p>

                            <div className="rounded-xl border border-[#eee5dc] bg-white p-4">
                              <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#1e2b2b]">
                                {item.question}
                              </p>
                            </div>
                          </div>

                          {/* ADMIN ANSWER */}
                          <div>
                            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#1e2b2b]">
                              <FaCheckCircle />
                              Admin Reply
                            </p>

                            {answered ? (
                              <div className="rounded-xl border border-[#dce8dc] bg-[#f5f9f3] p-4">
                                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#304b35]">
                                  {answer}
                                </p>

                                {item.answeredBy?.name && (
                                  <p className="mt-4 border-t border-[#dce8dc] pt-3 text-xs text-gray-500">
                                    Replied by {item.answeredBy.name}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-start gap-3 rounded-xl border border-[#eadbc4] bg-[#fcf8f0] p-4">
                                <FaClock className="mt-1 shrink-0 text-[#b48b6a]" />

                                <div>
                                  <p className="text-sm font-medium text-[#775a3f]">
                                    Waiting for admin reply
                                  </p>

                                  <p className="mt-1 text-xs leading-6 text-gray-500">
                                    Our team has not replied to this
                                    question yet. Please check again later.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* VIEW PRODUCT */}
                          {item.product?._id && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/product/${item.product._id}`)
                              }
                              className="inline-flex items-center gap-2 text-sm font-medium text-[#9a7557] transition hover:text-[#1e2b2b]"
                            >
                              View Product
                              <FaArrowRight className="text-xs" />
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center">
          <p className="font-serif text-lg italic text-[#8d674d]">
            A little care, a little glow.
          </p>

          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-gray-400">
            Lumière Skincare
          </p>
        </div>
      </main>
    </div>
  );
};

export default MyAccount;
