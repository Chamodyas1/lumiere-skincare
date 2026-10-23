const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['cleanser', 'moisturizer', 'serum', 'sunscreen', 'mask', 'fragrance', 'makeup', 'haircare'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  originalPrice: {
    type: Number,
    min: [0, 'Price cannot be negative'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  images: [{
    type: String,
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  isBestSeller: {
    type: Boolean,
    default: false,
  },
  isNew: {
    type: Boolean,
    default: false,
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  ingredients: [{
    type: String,
  }],
  benefits: [{
    type: String,
  }],
  howToUse: {
    type: String,
  },
  skinType: [{
    type: String,
    enum: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
  }],
  salesCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);