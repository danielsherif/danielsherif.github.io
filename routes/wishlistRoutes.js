const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const { protect } = require("../middleware/authMiddleware");

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      // Create empty wishlist if none exists
      wishlist = await Wishlist.create({
        user: req.user._id,
        items: [],
      });
    }

    res.json(wishlist);
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/wishlist
// @desc    Add item to wishlist
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { productId, name, price, image } = req.body;

    if (!productId || !name || !price || !image) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      // Create new wishlist if none exists
      wishlist = await Wishlist.create({
        user: req.user._id,
        items: [],
      });
    }

    // Check if item already exists in wishlist
    const itemExists = wishlist.items.some(
      (item) => item.productId === productId
    );

    if (itemExists) {
      return res
        .status(400)
        .json({ message: "Item already exists in wishlist" });
    }

    // Add new item
    wishlist.items.push({
      productId,
      name,
      price,
      image,
    });

    wishlist.updatedAt = Date.now();
    await wishlist.save();

    res.status(201).json(wishlist);
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/wishlist/:productId
// @desc    Remove item from wishlist
// @access  Private
router.delete("/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Find item index
    const itemIndex = wishlist.items.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    // Remove item
    wishlist.items.splice(itemIndex, 1);
    wishlist.updatedAt = Date.now();
    await wishlist.save();

    res.json(wishlist);
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/wishlist
// @desc    Clear wishlist
// @access  Private
router.delete("/", protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Clear items
    wishlist.items = [];
    wishlist.updatedAt = Date.now();
    await wishlist.save();

    res.json(wishlist);
  } catch (error) {
    console.error("Clear wishlist error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
