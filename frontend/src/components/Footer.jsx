import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebook,
  FaTiktok,
  FaYoutube,
  FaTwitter,
  FaArrowRight,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#1e2b2b] text-white">

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>

            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-light tracking-[0.25em]">
                LUMIÈRE
              </h2>

              <p className="text-[9px] tracking-[0.45em] text-[#d4b68a] mt-1">
                SKINCARE
              </p>
            </Link>

            <p className="text-sm text-white/55 leading-relaxed mt-6 max-w-xs">
              Beautiful skincare essentials carefully selected to bring
              simplicity, quality and a little luxury to your everyday ritual.
            </p>

            <div className="flex items-center gap-3 mt-7">

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#b48b6a] transition"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#b48b6a] transition"
              >
                <FaFacebook />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#b48b6a] transition"
              >
                <FaTiktok />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#b48b6a] transition"
              >
                <FaYoutube />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#b48b6a] transition"
              >
                <FaTwitter />
              </a>

            </div>

          </div>

          {/* SHOP */}
          <div>

            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#d4b68a] mb-6">
              Shop
            </h3>

            <ul className="space-y-4 text-sm text-white/60">

              <li>
                <Link
                  to="/shop"
                  className="hover:text-[#d4b68a] transition"
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=cleansers"
                  className="hover:text-[#d4b68a] transition"
                >
                  Cleansers
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=serums"
                  className="hover:text-[#d4b68a] transition"
                >
                  Serums
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=moisturizers"
                  className="hover:text-[#d4b68a] transition"
                >
                  Moisturizers
                </Link>
              </li>

              <li>
                <Link
                  to="/shop?category=sunscreen"
                  className="hover:text-[#d4b68a] transition"
                >
                  Sunscreen
                </Link>
              </li>

            </ul>

          </div>

          {/* SUPPORT */}
          <div>

            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#d4b68a] mb-6">
              Customer Care
            </h3>

            <ul className="space-y-4 text-sm text-white/60">

              <li>
                <Link
                  to="/orders"
                  className="hover:text-[#d4b68a] transition"
                >
                  My Orders
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="hover:text-[#d4b68a] transition"
                >
                  Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="hover:text-[#d4b68a] transition"
                >
                  Shopping Cart
                </Link>
              </li>

              <li>
                <a href="#" className="hover:text-[#d4b68a] transition">
                  Shipping & Delivery
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-[#d4b68a] transition">
                  Returns & Refunds
                </a>
              </li>

            </ul>

          </div>

          {/* NEWSLETTER */}
          <div>

            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#d4b68a] mb-6">
              Stay in the Glow
            </h3>

            <p className="text-sm text-white/55 leading-relaxed mb-5">
              Subscribe for skincare tips, new arrivals and exclusive
              Lumière offers.
            </p>

            <div className="flex bg-white rounded-full overflow-hidden p-1">

              <input
                type="email"
                placeholder="Your email"
                className="min-w-0 flex-1 px-4 py-2 text-sm text-[#1e2b2b] outline-none"
              />

              <button
                className="w-11 h-11 rounded-full bg-[#b48b6a] text-white flex items-center justify-center hover:bg-[#d4b68a] hover:text-[#1e2b2b] transition"
              >
                <FaArrowRight />
              </button>

            </div>

            <p className="text-xs text-white/35 mt-4">
              No spam. Just beautiful skincare inspiration.
            </p>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 mt-14 pt-7 flex flex-col md:flex-row justify-between items-center gap-4">

          <p className="text-xs text-white/40">
            © 2026 Lumière Skincare. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-white/40">

            <a href="#" className="hover:text-[#d4b68a] transition">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-[#d4b68a] transition">
              Terms & Conditions
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;