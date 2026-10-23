
const mongoose = require('mongoose');

const productQuestionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },

    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
      maxlength: [1000, 'Question cannot exceed 1000 characters'],
    },

    answer: {
      type: String,
      trim: true,
      maxlength: [3000, 'Answer cannot exceed 3000 characters'],
      default: '',
    },

    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    status: {
      type: String,
      enum: ['pending', 'answered'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

productQuestionSchema.index({ product: 1, createdAt: -1 });

module.exports = mongoose.model(
  'ProductQuestion',
  productQuestionSchema
);
