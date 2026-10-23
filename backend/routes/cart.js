const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart
router.get('/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.params.userId })
      .populate('items.product');
    
    if (!cart) {
      cart = new Cart({ user: req.params.userId, items: [] });
      await cart.save();
    }
    
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add to cart
router.post('/', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json({ success: true, cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Remove from cart
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update quantity
router.put('/', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
    
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    
    await cart.save();
    await cart.populate('items.product');
    
    res.json({ success: true, cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Clear cart
router.delete('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    
    cart.items = [];
    await cart.save();
    
    res.json({ success: true, message: 'Cart cleared successfully', cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;