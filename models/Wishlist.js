const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [wishlistItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;