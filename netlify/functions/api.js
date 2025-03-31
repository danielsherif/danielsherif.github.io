// netlify/functions/api.js

const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();

// --- Database Connection ---
async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

// --- CORS Configuration ---
const corsOptions = {
  origin: [
    "https://brewandclay.me", // Your frontend
    "https://sweet-cobbler-5c0ef9.netlify.app",
    "http://localhost:3000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
  optionsSuccessStatus: 204,
};

// --- Middleware Setup ---
app.use(cors(corsOptions)); // Apply CORS first
app.use(express.json()); // Then parse JSON

// Request Logger
app.use((req, res, next) => {
  // This log now accurately reflects the path Express received
  console.log(`Function Request: ${req.method} ${req.path}`);
  next();
});

// --- Mongoose Schema and Models ---
// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true, select: false },
  createdAt: { type: Date, default: Date.now },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Cart Schema
const cartItemSchema = new mongoose.Schema({
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
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [cartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

// Wishlist Schema
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

const Wishlist =
  mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);

// --- JWT Generation ---
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error("FATAL: JWT_SECRET missing");
    return null;
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// --- Authentication Middleware ---
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized, no token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// --- API Routes ---
// <<< ROUTES NOW INCLUDE /api/ PREFIX >>>

// Base route (matches requests to /api/)
app.get("/api/", (req, res) => {
  // <-- Added /api/ back
  console.log("Request received for ROOT path '/api/'");
  res.status(200).json({ message: "Brew & Clay API is active!" });
});

// Register User Route (matches requests to /api/users/register)
app.post("/api/users/register", async (req, res, next) => {
  // <-- Added /api/ back
  console.log("Handling registration for:", req.body.email);
  try {
    await connectToDatabase();
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ name, email, phone, password });
    const token = generateToken(newUser._id);
    if (!token) {
      return res.status(500).json({ message: "Token generation failed." });
    }

    console.log("User registered:", newUser.email);
    res.status(201).json({
      /* user data & token */
    }); // Truncated for brevity
  } catch (error) {
    next(error);
  }
});

// Login User Route (matches requests to /api/users/login)
app.post("/api/users/login", async (req, res, next) => {
  // <-- Added /api/ back
  console.log("Handling login for:", req.body.email);
  try {
    await connectToDatabase();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email/password required" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    if (!token) {
      return res.status(500).json({ message: "Token generation failed." });
    }

    console.log("User logged in:", user.email);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: token,
    });
  } catch (error) {
    next(error);
  }
});

// --- Cart Routes ---
// Get user's cart
app.get("/api/cart", protect, async (req, res) => {
  try {
    await connectToDatabase();
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

// Add item to cart
app.post("/api/cart", protect, async (req, res) => {
  try {
    await connectToDatabase();
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

// Update cart item quantity
app.put("/api/cart/:productId", protect, async (req, res) => {
  try {
    await connectToDatabase();
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

// Remove item from cart
app.delete("/api/cart/:productId", protect, async (req, res) => {
  try {
    await connectToDatabase();
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

// Clear cart
app.delete("/api/cart", protect, async (req, res) => {
  try {
    await connectToDatabase();
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

// --- Wishlist Routes ---
// Get user's wishlist
app.get("/api/wishlist", protect, async (req, res) => {
  try {
    await connectToDatabase();
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

// Add item to wishlist
app.post("/api/wishlist", protect, async (req, res) => {
  try {
    await connectToDatabase();
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

// Remove item from wishlist
app.delete("/api/wishlist/:productId", protect, async (req, res) => {
  try {
    await connectToDatabase();
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

// Clear wishlist
app.delete("/api/wishlist", protect, async (req, res) => {
  try {
    await connectToDatabase();
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

// --- Catch-All for Routes Not Found in Express App ---
app.use((req, res, next) => {
  // This handler will now catch things like /api/nonexistent/route
  console.log(`404 API Route Not Found in Express for path: ${req.path}`);
  res
    .status(404)
    .json({ error: "Not Found - The specific API route does not exist." });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack || err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// --- Export handler ---
exports.handler = serverless(app);
