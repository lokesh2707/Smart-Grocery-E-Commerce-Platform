const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// In-memory cart storage (in production, use Redis or database)
const carts = new Map();

// @route   GET /api/cart
// @desc    Get user's cart
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const cart = carts.get(userId) || { items: [], total: 0 };

    // Populate product details
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) return null;

        return {
          productId: item.productId,
          name: product.name,
          price: item.price,
          variant: item.variant,
          quantity: item.quantity,
          total: item.total,
          image: product.image
        };
      })
    );

    const validItems = populatedItems.filter(item => item !== null);
    const total = validItems.reduce((sum, item) => sum + item.total, 0);

    res.json({
      items: validItems,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1, variant } = req.body;
    const userId = req.user._id.toString();

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let price = product.price;
    if (variant && product.variants.length > 0) {
      const variantObj = product.variants.find(v => v.name === variant);
      if (variantObj) {
        price = variantObj.price;
      }
    }

    const cart = carts.get(userId) || { items: [] };
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.variant === variant
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].total = cart.items[existingItemIndex].quantity * price;
    } else {
      cart.items.push({
        productId,
        variant: variant || 'default',
        quantity,
        price,
        total: quantity * price
      });
    }

    carts.set(userId, cart);

    res.json({ message: 'Item added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/cart/update
// @desc    Update cart item quantity
router.put('/update', protect, async (req, res) => {
  try {
    const { productId, quantity, variant } = req.body;
    const userId = req.user._id.toString();

    const cart = carts.get(userId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.variant === variant
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].total = quantity * cart.items[itemIndex].price;
    }

    carts.set(userId, cart);
    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/cart/remove/:productId
// @desc    Remove item from cart
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;
    const { variant } = req.query;
    const userId = req.user._id.toString();

    const cart = carts.get(userId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => !(item.productId.toString() === productId && item.variant === variant)
    );

    carts.set(userId, cart);
    res.json({ message: 'Item removed from cart', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear cart
router.delete('/clear', protect, async (req, res) => {
  try {
    const userId = req.user._id.toString();
    carts.set(userId, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
