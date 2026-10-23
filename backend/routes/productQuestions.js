
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const ProductQuestion = require('../models/ProductQuestion');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// ========================================
// CUSTOMER: ASK A QUESTION ABOUT A PRODUCT
// POST /api/product-questions/product/:productId
// ========================================
router.post('/product/:productId', protect, async (req, res) => {
  try {
    const { question } = req.body;
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      });
    }

    if (typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your question',
      });
    }

    if (question.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Question cannot exceed 1000 characters',
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const newQuestion = await ProductQuestion.create({
      product: product._id,
      user: req.user._id,
      question: question.trim(),
    });

    const savedQuestion = await ProductQuestion.findById(newQuestion._id)
      .populate('product', 'name images image')
      .populate('user', 'name');

    res.status(201).json({
      success: true,
      message: 'Your question has been submitted',
      question: savedQuestion,
    });
  } catch (error) {
    console.error('Submit question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit question',
    });
  }
});

// ========================================
// CUSTOMER: VIEW ONLY THEIR OWN QUESTIONS
// GET /api/product-questions/my
// ========================================
router.get('/my', protect, async (req, res) => {
  try {
    const questions = await ProductQuestion.find({
      user: req.user._id,
    })
      .populate('product', 'name images image')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error('Get my questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load your questions',
    });
  }
});

// ========================================
// ADMIN: VIEW ALL CUSTOMER QUESTIONS
// GET /api/product-questions/admin/all
// ========================================
router.get('/admin/all', protect, admin, async (req, res) => {
  try {
    const questions = await ProductQuestion.find()
      .populate('product', 'name images image')
      .populate('user', 'name email')
      .populate('answeredBy', 'name')
      .sort({ status: 1, createdAt: -1 });

    res.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error('Admin get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load questions',
    });
  }
});

// ========================================
// ADMIN: REPLY TO A CUSTOMER QUESTION
// PUT /api/product-questions/admin/:id/answer
// ========================================
router.put('/admin/:id/answer', protect, admin, async (req, res) => {
  try {
    const { answer } = req.body;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID',
      });
    }

    if (typeof answer !== 'string' || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a reply',
      });
    }

    if (answer.trim().length > 3000) {
      return res.status(400).json({
        success: false,
        message: 'Reply cannot exceed 3000 characters',
      });
    }

    const question = await ProductQuestion.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    question.answer = answer.trim();
    question.answeredBy = req.user._id;
    question.status = 'answered';

    await question.save();

    const updatedQuestion = await ProductQuestion.findById(question._id)
      .populate('product', 'name images image')
      .populate('user', 'name email')
      .populate('answeredBy', 'name');

    res.json({
      success: true,
      message: 'Reply submitted successfully',
      question: updatedQuestion,
    });
  } catch (error) {
    console.error('Answer question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit reply',
    });
  }
});

// ========================================
// ADMIN: DELETE A QUESTION
// DELETE /api/product-questions/admin/:id
// ========================================
router.delete('/admin/:id', protect, admin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID',
      });
    }

    const question = await ProductQuestion.findByIdAndDelete(
      req.params.id
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete question',
    });
  }
});

module.exports = router;
