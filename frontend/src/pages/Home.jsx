
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaMagic,
  FaTint,
  FaFlask,
  FaSun,
  FaRegSmile,
  FaSpa,
  FaStar,
  FaLeaf,
  FaShieldAlt,
  FaShippingFast,
  FaHeart,
} from "react-icons/fa";
const slides = [
  {
    title: "Discover Your Natural Glow",
    highlight: "Luxury Skincare",
    description:
      "Explore premium skincare essentials designed to nourish your skin and reveal your natural radiance.",
    image:
  "https://images.openai.com/static-rsc-4/gqShwNphN9fFM-b4kTLVe8d4dC8iW9BvaJRajJqFq-3FiYOtJh8TdyRpNyYxkbSarzjtX35uRm9yeC3n8LEGXK7nS9pIlk54NXELEB8sELFPDJmrQYlB7FGChj69KWQU9fFE_N1-d8EpCh3I9ZQpPSoAioOsWZ8y81Kh_fN3TTCDcyq0xZG876LSa0aw3-f-?purpose=fullsize",
    buttonText: "Shop Collection",
    link: "/shop",
  },
  {
    title: "Your Everyday Beauty Ritual",
    highlight: "Pure & Beautiful",
    description:
      "Discover the perfect balance of gentle care, beautiful skin, and timeless elegance.",
    image:
      "https://images.unsplash.com/photo-1783806706119-58cc39f90ff4?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    buttonText: "Explore Products",
    link: "/shop",
  },
  {
    title: "Skincare That Feels Special",
    highlight: "Glow Naturally",
    description:
      "Find your new favourites and create a skincare routine that celebrates your natural beauty.",
    image:
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=2000&q=85",
    buttonText: "Discover More",
    link: "/shop",
  },
 
  {
    title: "Your Skin Deserves the Best",
    highlight: "Beauty Begins Here",
    description:
      "Step into a world of skincare inspiration and discover products you'll love.",
    image:
      "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    buttonText: "Shop Now",
    link: "/shop",
  },
  {
    title: "A Little Luxury Every Day",
    highlight: "Love Your Skin",
    description:
      "Give your skin the care it deserves with thoughtfully selected beauty essentials.",
    image:
      "https://plus.unsplash.com/premium_photo-1708333929228-ed3fdd453b8e?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    buttonText: "Explore Products",
    link: "/routine-finder",
  },
];
  

const categories = [
  { icon: FaMagic, name: "Cleansers", value: "cleanser" },
  { icon: FaTint, name: "Moisturizers", value: "moisturizer" },
  { icon: FaFlask, name: "Serums", value: "serum" },
  { icon: FaSun, name: "Sunscreen", value: "sunscreen" },
  { icon: FaRegSmile, name: "Masks", value: "mask" },
  { icon: FaSpa, name: "Beauty Tools", value: "beauty-tools" },
];

const products = [
  {
    name: "Lumière Glow Serum",
    type: "Brightening Serum",
    price: "$42.00",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Hydra Velvet Cream",
    type: "Daily Moisturizer",
    price: "$36.00",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=800&q=85",
  },
  {
    name: "Pure Balance Cleanser",
    type: "Gentle Cleanser",
    price: "$28.00",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=85",
  },
];

const features = [
  {
    icon: FaLeaf,
    title: "Thoughtful Ingredients",
    text: "Carefully selected skincare essentials for your everyday ritual.",
  },
  {
    icon: FaShieldAlt,
    title: "Skin-Loving Care",
    text: "Build a gentle routine around your skin's individual needs.",
  },
  {
    icon: FaShippingFast,
    title: "Convenient Delivery",
    text: "Shop your favourites and have your essentials delivered.",
  },
  {
    icon: FaHeart,
    title: "Made for Your Ritual",
    text: "Thoughtful skincare to make your daily routine feel special.",
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);

    return () => clearInterval(timer);
  }, []);

  const previousSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentSlide];

  const handleSubscribe = (event) => {
    event.preventDefault();

    if (!email.trim()) return;

    alert("Thank you for your interest in Lumière!");
    setEmail("");
  };

  return (
    <main className="overflow-hidden bg-[#fcf8f5] text-[#263333]">

      {/* HERO SLIDER */}

      <section className="relative min-h-[650px] overflow-hidden bg-[#182421] lg:min-h-[740px]">

        <div
          key={currentSlide}
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url("${slide.image}")`,
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#14221f]/95 via-[#14221f]/75 to-[#14221f]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14221f]/50 via-transparent to-black/10" />

        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#c9a779]/10 blur-[100px]" />

        <div className="relative z-10 mx-auto flex min-h-[650px] max-w-7xl items-center px-6 py-20 lg:min-h-[740px] lg:px-16">

          <div className="max-w-2xl text-white">

            <div className="mb-8 inline-flex items-center gap-3 border border-[#d8bb91]/40 bg-black/10 px-5 py-3 backdrop-blur-sm">
              <FaLeaf className="text-[#d8bb91]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#f1d9b3]">
                {slide.small}
              </span>
            </div>

            <h1 className="text-5xl font-light leading-[1.08] tracking-tight sm:text-6xl md:text-7xl lg:text-[86px]">
              {slide.title}
              <span className="mt-2 block font-serif italic text-[#dfbd8e]">
                {slide.highlight}
              </span>
            </h1>

            <div className="my-8 flex items-center gap-3">
              <span className="h-px w-14 bg-[#d8bb91]" />
              <span className="h-2 w-2 rotate-45 border border-[#d8bb91]" />
            </div>

            <p className="max-w-lg text-base leading-8 text-white/80 md:text-lg">
              {slide.text}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">

              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 rounded-full bg-[#d8bb91] px-8 py-4 font-semibold text-[#1c2929] shadow-xl transition duration-300 hover:bg-white"
              >
                Explore Collection
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/routine-finder"
                className="inline-flex items-center gap-3 rounded-full border border-white/50 px-8 py-4 text-white transition duration-300 hover:border-[#d8bb91] hover:bg-white/10"
              >
                Find Your Routine
              </Link>

            </div>

            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs text-white/75 sm:text-sm">
              <div className="flex items-center gap-2">
                <FaLeaf className="text-[#d8bb91]" />
                Thoughtful Skincare
              </div>
              <div className="flex items-center gap-2">
                <FaShieldAlt className="text-[#d8bb91]" />
                Everyday Essentials
              </div>
              <div className="flex items-center gap-2">
                <FaStar className="text-[#d8bb91]" />
                Your Beauty Ritual
              </div>
            </div>

          </div>
        </div>

        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-md transition hover:bg-[#d8bb91] hover:text-[#1c2929] md:left-7 md:h-12 md:w-12"
        >
          <FaChevronLeft />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur-md transition hover:bg-[#d8bb91] hover:text-[#1c2929] md:right-7 md:h-12 md:w-12"
        >
          <FaChevronRight />
        </button>

        <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
          {slides.map((item, index) => (
            <button
              key={item.small}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-500 ${
                currentSlide === index
                  ? "w-12 bg-[#d8bb91]"
                  : "w-5 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>

      </section>

      {/* STATS */}

      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="grid grid-cols-2 gap-6 rounded-[35px] bg-[#f3ede8] px-6 py-9 text-center md:grid-cols-4 md:px-8">
          {[
            ["Thoughtful", "Product Selection"],
            ["Daily", "Skincare Essentials"],
            ["Your Skin", "Your Routine"],
            ["Self-Care", "Every Day"],
          ].map(([number, label]) => (
            <div key={label}>
              <h3 className="font-serif text-2xl text-[#8d6b4f] md:text-3xl">
                {number}
              </h3>
              <p className="mt-2 text-sm text-[#665e57]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">

        <div className="mb-9 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#b48b6a]">
              Explore the collection
            </p>
            <h2 className="text-3xl font-light md:text-4xl">
              Shop by <span className="font-semibold">Category</span>
            </h2>
          </div>

          <Link
            to="/shop"
            className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[#987052] hover:gap-3"
          >
            View All <FaArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat) => {
            const Icon = cat.icon;

            return (
              <Link
                key={cat.name}
                to={`/shop?category=${cat.value}`}
                className="group rounded-[25px] border border-[#eadbd0] bg-white p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-[#c9a779] hover:shadow-lg md:p-6"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3e8dd] transition group-hover:bg-[#e7d3bf]">
                  <Icon className="text-2xl text-[#a47b59]" />
                </div>
                <h3 className="text-sm font-medium text-[#263333]">
                  {cat.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* BESTSELLERS */}

      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">

          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#b48b6a]">
              Thoughtfully selected
            </p>
            <h2 className="text-3xl font-light md:text-5xl">
              Our <span className="font-semibold">Bestsellers</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-500">
              Discover everyday skincare essentials for a simple, enjoyable
              and well-considered routine.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.name}
                className="group overflow-hidden rounded-[28px] bg-[#fcf8f5] transition duration-500 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-[300px] overflow-hidden sm:h-[360px]">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.style.visibility = "hidden";
                    }}
                  />

                  <span className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-[10px] font-semibold tracking-[0.15em]">
                    CUSTOMER FAVOURITE
                  </span>

                  <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#b48b6a]">
                    <FaHeart />
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#b48b6a]">
                    {product.type}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    {product.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <div className="flex gap-1 text-[#c49b60]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} />
                      ))}
                    </div>
                    <span className="text-gray-500">{product.rating}</span>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="text-xl font-semibold">
                      {product.price}
                    </span>
                    <Link
                      to="/shop"
                      className="flex items-center gap-2 text-sm font-semibold text-[#987052] hover:gap-3"
                    >
                      Explore <FaArrowRight />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 rounded-full bg-[#1c2929] px-8 py-4 font-semibold text-white transition hover:bg-[#b48b6a]"
            >
              View All Products <FaArrowRight />
            </Link>
          </div>

        </div>
      </section>

            {/* SKIN TYPE QUIZ + ROUTINE FINDER */}

      <section className="bg-[#f3ede8] py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">

          {/* SECTION HEADING */}
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#b48b6a]">
              Your Personal Skincare Journey
            </p>

            <h2 className="text-3xl font-light text-[#1e2b2b] md:text-5xl">
              Discover Your{" "}
              <span className="font-semibold">
                Perfect Ritual
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-600">
              Every skin is unique. Discover your skin type and explore a
              routine tailored to your everyday needs.
            </p>
          </div>

          {/* TWO IMAGE CARDS */}
          <div className="grid gap-7 md:grid-cols-2">

            {/* SKIN TYPE QUIZ CARD */}
            <div className="relative overflow-hidden rounded-[32px] bg-[#e6d8ca]">

              <img
                src="https://images.unsplash.com/photo-1674867688817-a75fcad569c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                alt="Healthy glowing skin"
                loading="lazy"
                className="h-[420px] w-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#1e2b2b]/95 via-[#1e2b2b]/45 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 z-10 p-8 md:p-10">

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-2xl">
                  ✨
                </div>

                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#e8cba8]">
                  Step 01 · Discover
                </p>

                <h3 className="text-3xl font-semibold text-white md:text-4xl">
                  What Is Your Skin Type?
                </h3>

                <p className="mt-4 max-w-md leading-7 text-white/85">
                  Explore your skin type and learn more about what your skin
                  may need in your daily routine.
                </p>

                <Link
                  to="/skin-quiz"
                  className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[#d8bb91] px-7 py-4 font-semibold text-[#1e2b2b] transition hover:bg-white"
                >
                  Take the Quiz
                  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>

              </div>
            </div>

            {/* ROUTINE FINDER CARD */}
            <div className="relative overflow-hidden rounded-[32px] bg-[#1e2b2b]">

              <img
                src="https://plus.unsplash.com/premium_photo-1755892594620-a38b81e66610?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                alt="Luxury skincare products"
                loading="lazy"
                className="h-[420px] w-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#1e2b2b]/95 via-[#1e2b2b]/50 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 z-10 p-8 text-white md:p-10">

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                  🧴
                </div>

                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#d8bb91]">
                  Step 02 · Personalize
                </p>

                <h3 className="text-3xl font-semibold md:text-4xl">
                  Your Perfect Skincare Routine
                </h3>

                <p className="mt-4 max-w-md leading-7 text-white/85">
                  Explore morning and evening steps, helpful skincare tips
                  and guidance for your skin concerns.
                </p>

                <Link
                  to="/routine-finder"
                  className="group mt-6 inline-flex items-center gap-3 rounded-full bg-[#d8bb91] px-7 py-4 font-semibold text-[#1e2b2b] transition hover:bg-white"
                >
                  Find My Routine
                  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BRAND STORY */}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1630826888603-7eb14e9f05d1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
              alt="A relaxing skincare ritual"
              loading="lazy"
              className="h-[400px] w-full rounded-[35px] object-cover md:h-[540px]"
            />

            <div className="absolute -bottom-6 right-4 max-w-[230px] rounded-[25px] bg-[#1c2929] p-6 text-white shadow-xl md:right-8">
              <FaLeaf className="mb-4 text-3xl text-[#d8bb91]" />
              <p className="font-serif text-lg leading-relaxed">
                Beauty begins with taking care of yourself.
              </p>
            </div>
          </div>

          <div className="pt-5 lg:pl-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#b48b6a]">
              The Lumière Philosophy
            </p>

            <h2 className="text-4xl font-light leading-tight md:text-5xl">
              Simple rituals.
              <span className="mt-2 block font-semibold">
                Beautiful moments.
              </span>
            </h2>

            <p className="mt-7 text-lg leading-8 text-gray-600">
              Skincare can be more than a daily task. It can be a moment to
              slow down, reconnect with yourself and enjoy a little everyday
              luxury.
            </p>

            <p className="mt-4 leading-7 text-gray-500">
              From gentle cleansers to nourishing moisturizers, explore
              skincare essentials and create a routine that suits your
              preferences and needs.
            </p>

            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-3 border-b border-[#b48b6a] pb-2 font-semibold text-[#987052] transition-all hover:gap-5"
            >
              Discover Lumière <FaArrowRight />
            </Link>
          </div>

        </div>
      </section>

      {/* WHY LUMIERE */}

      <section className="bg-[#efe7df] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">

          <div className="mb-14 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#b48b6a]">
              Why Lumière
            </p>
            <h2 className="text-3xl font-light md:text-5xl">
              Made for your <span className="font-semibold">ritual</span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="rounded-[28px] bg-white/80 p-8 text-center transition duration-300 hover:-translate-y-2 hover:shadow-lg"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8d9ca] text-2xl text-[#a47b59]">
                    <Icon />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {feature.text}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      {/* PRODUCT QUESTIONS & ANSWERS */}

      <section className="bg-[#fcf8f5] px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-10 overflow-hidden rounded-[35px] border border-[#eadbd0] bg-white p-7 shadow-sm md:grid-cols-2 md:p-12 lg:p-14">

            {/* LEFT CONTENT */}

            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#b48b6a]">
                Customer Support
              </p>

              <h2 className="text-3xl font-light leading-tight text-[#1e2b2b] md:text-5xl">
                Have a Question?
                <span className="mt-2 block font-semibold">
                  We're Here to Help.
                </span>
              </h2>

              <p className="mt-6 max-w-lg leading-7 text-gray-600">
                Have questions about ingredients, product benefits, or
                choosing the right skincare for you? Ask our team and get
                helpful answers for your skincare journey.
              </p>

              <Link
                to="/shop"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#1c2929] px-7 py-4 font-semibold text-white transition duration-300 hover:bg-[#b48b6a]"
              >
                Explore Products & Ask
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>

              <p className="mt-4 text-xs leading-6 text-gray-500">
                Sign in to ask a question. Your questions and replies
                are visible only to your account.
              </p>
            </div>

            {/* RIGHT IMAGE */}

            <div className="relative min-h-[320px] overflow-hidden rounded-[30px] bg-[#f3ede8] md:min-h-[420px]">

              <img
                src="https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1000&q=85"
                alt="Luxury skincare products"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-105"
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#1c2929]/60 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/50 bg-white/90 p-5 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3e8dd] text-lg text-[#a47b59]">
                    <FaRegSmile />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#1e2b2b]">
                      Your Questions Matter
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      We're here for your skincare journey.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
      {/* TESTIMONIAL */}

      <section className="bg-[#1c2929] py-20 text-white md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">

          <div className="mb-7 flex justify-center gap-1 text-[#d8bb91]">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar key={star} />
            ))}
          </div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#d8bb91]">
            A Moment of Self-Care
          </p>

          <blockquote className="font-serif text-2xl font-light leading-relaxed md:text-4xl">
            “My favourite part of the day is taking a little time for
            myself and my skincare routine.”
          </blockquote>

          <div className="mt-8">
            <p className="font-semibold text-[#d8bb91]">
              The Lumière Community
            </p>
            <p className="mt-1 text-sm text-white/50">
              A little luxury, every day
            </p>
          </div>

        </div>
      </section>

      {/* NEWSLETTER */}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
        <div className="rounded-[35px] bg-[#e9ddd1] px-6 py-14 text-center md:rounded-[40px] md:px-16 md:py-16">

          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#987052]">
              Stay in the Glow
            </p>

            <h2 className="mt-4 text-3xl font-light md:text-5xl">
              Your skincare,
              <span className="block font-semibold">
                beautifully curated.
              </span>
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              Discover skincare inspiration, new arrivals and updates from
              Lumière.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                aria-label="Your email address"
                className="min-w-0 flex-1 rounded-full border border-white bg-white px-6 py-4 outline-none transition focus:ring-2 focus:ring-[#b48b6a]"
              />

              <button
                type="submit"
                className="rounded-full bg-[#1c2929] px-8 py-4 font-semibold text-white transition hover:bg-[#b48b6a] hover:text-[#1c2929]"
              >
                Subscribe
              </button>
            </form>

            <p className="mt-4 text-xs text-gray-500">
              By subscribing, you agree to receive updates from Lumière.
            </p>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}

      <section className="px-6 pb-20 md:pb-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-[35px] bg-[#1c2929] px-8 py-12 text-white md:flex-row md:items-center md:px-16 md:py-16">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d8bb91]">
              Begin Your Ritual
            </p>

            <h2 className="mt-4 text-3xl font-light md:text-4xl">
              Ready to meet your
              <span className="block font-semibold">
                new favourites?
              </span>
            </h2>

            <p className="mt-4 max-w-lg leading-7 text-white/65">
              Discover your next skincare essential and make a little space
              for yourself every day.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex shrink-0 items-center gap-3 rounded-full bg-[#d8bb91] px-8 py-4 font-semibold text-[#1c2929] transition hover:bg-white"
          >
            Shop Lumière <FaArrowRight />
          </Link>

        </div>
      </section>

    </main>
  );
};

export default Home;
