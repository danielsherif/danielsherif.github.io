// netlify/functions/api.js

const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config(); // Make sure dotenv runs early

const app = express();

// --- Database Connection ---
async function connectToDatabase() {
  // Check if already connected or connecting
  if (mongoose.connection.readyState >= 1) {
    console.log("Database already connected.");
    return;
  }
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Consider adding serverSelectionTimeoutMS for better error handling on connect
      // serverSelectionTimeoutMS: 5000,
    });
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection error:", error);
    // Rethrow or handle appropriately - maybe prevent server start?
    // In a serverless context, subsequent requests might fail if DB is needed.
    throw error; // Rethrowing might cause function invocation to fail, which is often desired
  }
}

// --- CORS Configuration ---
const corsOptions = {
  // Ensure your production frontend URL is correct and doesn't end with a slash unless intended
  origin: [
    "https://brewandclay.me",
    "https://sweet-cobbler-5c0ef9.netlify.app", // Your Netlify frontend URL
    "http://localhost:3000", // Common React dev port
    "http://localhost:8080", // Your apparent local frontend port
    "http://127.0.0.1:8080", // Explicit localhost IP
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization", // Only allow necessary headers
  credentials: true,
  optionsSuccessStatus: 204, // Standard for OPTIONS preflight success
};

// --- Middleware Setup ---
// 1. Apply CORS Middleware FIRST - Handles OPTIONS preflight automatically
app.use(cors(corsOptions));

// 2. Parse JSON request bodies AFTER CORS
app.use(express.json());

// 3. Basic Request Logger (Optional but helpful)
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.path}`);
  next();
});

// --- Mongoose Schema and Model ---
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
  password: { type: String, required: true, select: false }, // Keep password hidden by default
  createdAt: { type: Date, default: Date.now },
});

// Password Hashing Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error); // Pass error to Express error handler
  }
});

// Password Comparison Method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Register model, handling potential hot-reloading issues
const User = mongoose.models.User || mongoose.model("User", userSchema);

// --- JWT Generation ---
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    // In a real app, you might want to prevent startup or throw a more specific error
    return null; // Or throw an error
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Consider a shorter duration for production
  });
};

// --- API Routes ---

// Base route for testing if the API function is reachable
app.get("/api/", (req, res) => {
  console.log("Request received for ROOT /api/ path");
  res.status(200).json({ message: "Brew & Clay API is active!" });
});

// Register User Route
// Note: The path will be accessible via /api/users/register due to Netlify redirect
app.post("/api/users/register", async (req, res, next) => {
  // Added next for error handling
  console.log("Attempting user registration for:", req.body.email);
  try {
    await connectToDatabase(); // Ensure DB connection
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      console.log("Registration failed: Missing required fields");
      return res
        .status(400)
        .json({
          message: "All fields (name, email, phone, password) are required",
        });
    }

    // Basic email validation (consider a more robust library like validator)
    if (!/\S+@\S+\.\S+/.test(email)) {
      console.log("Registration failed: Invalid email format");
      return res.status(400).json({ message: "Invalid email format" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log(
        "Registration failed: User already exists with email:",
        email
      );
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const newUser = await User.create({ name, email, phone, password }); // Password will be hashed by pre-save hook

    // Don't send password back, even hashed
    const token = generateToken(newUser._id);
    if (!token) {
      // Handle error if JWT secret was missing
      return res
        .status(500)
        .json({ message: "Could not generate authentication token." });
    }

    console.log("User registered successfully:", newUser.email);
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      token: token,
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    next(error); // Pass error to the global error handler
  }
});

// Login User Route
// Note: The path will be accessible via /api/users/login
app.post("/api/users/login", async (req, res, next) => {
  // Added next
  console.log("Attempting user login for:", req.body.email);
  try {
    await connectToDatabase(); // Ensure DB connection
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Login failed: Email or password missing");
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password"); // Explicitly request password

    if (!user) {
      console.log("Login failed: No user found with email:", email);
      return res.status(401).json({ message: "Invalid email or password" }); // Generic message for security
    }

    const isMatch = await user.correctPassword(password, user.password);

    if (!isMatch) {
      console.log("Login failed: Password incorrect for email:", email);
      return res.status(401).json({ message: "Invalid email or password" }); // Generic message
    }

    const token = generateToken(user._id);
    if (!token) {
      return res
        .status(500)
        .json({ message: "Could not generate authentication token." });
    }

    console.log("User logged in successfully:", user.email);
    // Send back user data (without password) and token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: token,
    });
  } catch (error) {
    console.error("Error during user login:", error);
    next(error); // Pass error to the global error handler
  }
});

// --- Catch-All for Routes Not Found in Express App ---
// This will handle requests for paths like /api/nonexistentroute
// It should come AFTER all your valid routes
app.use((req, res, next) => {
  console.log(`404 Not Found for path: ${req.originalUrl}`); // Use originalUrl to see the full path requested
  res
    .status(404)
    .json({ error: "Not Found - The requested API endpoint does not exist." });
});

// --- Global Error Handler ---
// Must have 4 arguments (err, req, res, next) to be recognized by Express
// This should be the VERY LAST `app.use()` call
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack || err); // Log the full error stack
  // Avoid sending detailed error messages in production for security
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    // Optionally include error code or type in development
    // errorType: process.env.NODE_ENV === 'development' ? err.name : undefined,
  });
});

// --- Export the handler for Netlify Functions ---
// The path mapping is handled by serverless-http and Netlify redirects
exports.handler = serverless(app);
