const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create empty cart if none exists
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { productId, name, price, image, quantity } = req.body;

    if (!productId || !name || !price || !image) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create new cart if none exists
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex > -1) {
      // Item exists, update quantity
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      // Item doesn't exist, add new item
      cart.items.push({
        productId,
        name,
        price,
        image,
        quantity: quantity || 1,
      });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.status(201).json(cart);
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/cart/:productId
// @desc    Update cart item quantity
// @access  Private
router.put("/:productId", protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!quantity) {
      return res.status(400).json({ message: "Please provide quantity" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find item index
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update quantity or remove if quantity is 0
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.updatedAt = Date.now();
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/cart/:productId
// @desc    Remove item from cart
// @access  Private
router.delete("/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find item index
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove item
    cart.items.splice(itemIndex, 1);
    cart.updatedAt = Date.now();
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Clear items
    cart.items = [];
    cart.updatedAt = Date.now();
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
