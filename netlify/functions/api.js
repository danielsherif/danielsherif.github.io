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

// --- JWT Generation ---
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error("FATAL: JWT_SECRET missing");
    return null;
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
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
      /* user data & token */
    }); // Truncated for brevity
  } catch (error) {
    next(error);
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
