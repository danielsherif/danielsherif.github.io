const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Initialize express app
const app = express();

// Middleware
// Configure CORS with all necessary options
const corsOptions = {
  origin: [
    "https://brewandclay.me",
    "https://sweet-cobbler-5c0ef9.netlify.app",
    "http://localhost:3000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization,Origin,Accept,X-Requested-With",
  exposedHeaders: "Content-Length,Content-Type",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200,
  maxAge: 86400, // 24 hours
};

// Enable pre-flight requests for all routes
app.options("*", cors(corsOptions));

// Apply CORS middleware to all routes
app.use(cors(corsOptions));

// Add explicit handler for OPTIONS requests
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    );
    return res.status(200).json({});
  }
  return next();
});
app.use(express.json());

// MongoDB connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const client = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    cachedDb = client;
    return cachedDb;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    validate: {
      validator: function (value) {
        // Validate Egyptian phone number format (01 + 9 digits)
        return /^01\d{9}$/.test(value);
      },
      message: "Phone number must be in format 01XXXXXXXXX",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false, // Don't include password in query results by default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) return next();

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check if password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Create User model if it doesn't exist
const User = mongoose.models.User || mongoose.model("User", userSchema);

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

// API Routes

// Register route - support both path formats
app.post(["/users/register", "/api/users/register"], async (req, res) => {
  try {
    await connectToDatabase();

    const { name, email, phone, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Login route - support both path formats
app.post(["/users/login", "/api/users/login"], async (req, res) => {
  try {
    await connectToDatabase();

    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists and password is correct
    if (user && (await user.correctPassword(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Not found route
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Export the serverless function
module.exports.handler = serverless(app);
