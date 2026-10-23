
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create order and update product stock
router.post('/', async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one product.',
      });
    }

    // Validate items and product IDs
    for (const item of items) {
      if (
        !item.product ||
        !mongoose.Types.ObjectId.isValid(item.product) ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID or quantity.',
        });
      }
    }

    // Combine duplicate product IDs
    const quantities = new Map();

    for (const item of items) {
      const id = String(item.product);
      quantities.set(
        id,
        (quantities.get(id) || 0) + Number(item.quantity)
      );
    }

    const stockUpdates = [];

    // Check stock and reserve requested quantities
    for (const [productId, quantity] of quantities) {
      const product = await Product.findOneAndUpdate(
        {
          _id: productId,
          stock: { $gte: quantity },
        },
        {
          $inc: {
            stock: -quantity,
            salesCount: quantity,
          },
        },
        { new: true }
      );

      if (!product) {
        // Restore stock for products already updated
        for (const update of stockUpdates) {
          await Product.updateOne(
            { _id: update.productId },
            {
              $inc: {
                stock: update.quantity,
                salesCount: -update.quantity,
              },
            }
          );
        }

        const exists = await Product.exists({ _id: productId });

        return res.status(exists ? 400 : 404).json({
          success: false,
          message: exists
            ? 'Insufficient stock for one or more products.'
            : 'Product not found.',
        });
      }

      stockUpdates.push({ productId, quantity });
    }

    try {
      const order = new Order(req.body);
      await order.save();

      res.status(201).json({
        success: true,
        message: 'Order created and stock updated successfully.',
        order,
      });
    } catch (error) {
      // If saving the order fails, restore stock
      for (const update of stockUpdates) {
        await Product.updateOne(
          { _id: update.productId },
          {
            $inc: {
              stock: update.quantity,
              salesCount: -update.quantity,
            },
          }
        );
      }

      throw error;
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
