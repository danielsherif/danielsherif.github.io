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
    // console.log("Database already connected."); // Optional: Reduce noise in logs
    return;
  }
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // serverSelectionTimeoutMS: 5000, // Optional: For faster connection timeout detection
    });
    console.log("Database connected successfully.");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

// --- CORS Configuration ---
const corsOptions = {
  // Ensure your production frontend URL is correct
  origin: [
    "https://brewandclay.me",
    "https://sweet-cobbler-5c0ef9.netlify.app", // Your Netlify frontend URL
    "http://localhost:3000",
    "http://localhost:8080", // Your local frontend port
    "http://127.0.0.1:8080",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
  optionsSuccessStatus: 204,
};

// --- Middleware Setup ---
// 1. Apply CORS Middleware FIRST
app.use(cors(corsOptions));

// 2. Parse JSON request bodies AFTER CORS
app.use(express.json());

// 3. Basic Request Logger (Shows path *after* serverless-http mapping)
app.use((req, res, next) => {
  console.log(`Function Request: ${req.method} ${req.path}`); // req.path will NOT have /api/ prefix here
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
  password: { type: String, required: true, select: false },
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
    next(error);
  }
});

// Password Comparison Method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Register model
const User = mongoose.models.User || mongoose.model("User", userSchema);

// --- JWT Generation ---
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined.");
    return null;
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// --- API Routes ---
// IMPORTANT: Routes defined here do NOT include the /api prefix.
// The Netlify redirect handles the /api part.

// Base route (matches requests to /api/ because of redirect)
app.get("/", (req, res) => {
  console.log("Request received for ROOT path '/' within function");
  res.status(200).json({ message: "Brew & Clay API is active!" });
});

// Register User Route (matches requests to /api/users/register)
app.post("/users/register", async (req, res, next) => {
  console.log("Handling registration for:", req.body.email);
  try {
    await connectToDatabase();
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      console.log("Registration failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      console.log("Registration failed: Invalid email format");
      return res.status(400).json({ message: "Invalid email format" });
    }
    // You could add phone validation here too if desired

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("Registration failed: User exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ name, email, phone, password });
    const token = generateToken(newUser._id);

    if (!token) {
      return res
        .status(500)
        .json({ message: "Could not generate auth token." });
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
    next(error);
  }
});

// Login User Route (matches requests to /api/users/login)
app.post("/users/login", async (req, res, next) => {
  console.log("Handling login for:", req.body.email);
  try {
    await connectToDatabase();
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Login failed: Missing fields");
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.log("Login failed: User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.correctPassword(password, user.password);

    if (!isMatch) {
      console.log("Login failed: Password incorrect for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    if (!token) {
      return res
        .status(500)
        .json({ message: "Could not generate auth token." });
    }

    console.log("User logged in successfully:", user.email);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: token,
    });
  } catch (error) {
    console.error("Error during user login:", error);
    next(error);
  }
});

// --- Catch-All for Routes Not Found in Express App ---
// This handles requests like /api/nonexistent where '/nonexistent' doesn't match any route above
app.use((req, res, next) => {
  // Note: req.originalUrl might still show /api/nonexistent, while req.path would be /nonexistent
  console.log(
    `404 Function Route Not Found for path: ${req.path} (Original: ${req.originalUrl})`
  );
  res
    .status(404)
    .json({ error: "Not Found - The requested API sub-path does not exist." });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error("Global Error Handler Caught:", err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// --- Export the handler for Netlify Functions ---
exports.handler = serverless(app);
