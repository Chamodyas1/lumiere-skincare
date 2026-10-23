import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isWishlist, setIsWishlist] = React.useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    await addToCart(product._id, 1);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    setIsWishlist(!isWishlist);
    toast.success(isWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative bg-lumiere-warm rounded-2xl h-48 flex items-center justify-center overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-6xl text-lumiere-gold">✨</span>
          )}
          
          {/* Wishlist Button */}
          <button 
            onClick={handleWishlist}
            className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
          >
            {isWishlist ? (
              <FaHeart className="text-red-500 text-lg" />
            ) : (
              <FaRegHeart className="text-gray-400 text-lg hover:text-red-500 transition" />
            )}
          </button>

          {/* Badges */}
          {product.isBestSeller && (
            <span className="absolute top-3 left-3 bg-lumiere-dark text-white text-xs px-3 py-1 rounded-full">
              BESTSELLER
            </span>
          )}
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-lumiere-gold text-white text-xs px-3 py-1 rounded-full">
              NEW
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="absolute bottom-3 left-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div className="mt-4">
          <h5 className="font-semibold text-lg line-clamp-1">{product.name}</h5>
          <p className="text-sm text-lumiere-brown line-clamp-2">{product.description}</p>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xl font-bold text-lumiere-dark">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-lumiere-gold">
              <FaStar className="text-sm" />
              <span className="text-sm font-medium">{product.rating || 4.9}</span>
              <span className="text-xs text-gray-400">({product.reviewsCount || 0})</span>
            </div>
            <button 
              onClick={handleAddToCart}
              className="bg-lumiere-dark text-white px-4 py-1.5 rounded-full text-sm hover:bg-lumiere-gold hover:text-lumiere-dark transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;