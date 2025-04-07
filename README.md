# Brew and Clay - Artisan Mugs E-commerce

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
   - [Frontend Architecture](#frontend-architecture)
   - [Backend Architecture](#backend-architecture)
   - [Database Design](#database-design)
3. [Frontend Implementation](#frontend-implementation)
   - [Page Structure](#page-structure)
   - [UI Components](#ui-components)
   - [Client-Side Functionality](#client-side-functionality)
4. [Backend Implementation](#backend-implementation)
   - [Express Server](#express-server)
   - [Serverless Functions](#serverless-functions)
   - [API Endpoints](#api-endpoints)
5. [Authentication System](#authentication-system)
   - [User Registration](#user-registration)
   - [Login Process](#login-process)
   - [JWT Implementation](#jwt-implementation)
6. [Shopping Cart Implementation](#shopping-cart-implementation)
   - [Cart Data Structure](#cart-data-structure)
   - [Cart Operations](#cart-operations)
   - [Session vs. Server Storage](#session-vs-server-storage)
7. [Product Management](#product-management)
   - [Product Data Structure](#product-data-structure)
   - [Product Display](#product-display)
   - [Product Filtering](#product-filtering)
8. [Checkout Process](#checkout-process)
   - [Order Flow](#order-flow)
   - [Payment Methods](#payment-methods)
9. [Deployment](#deployment)
   - [GitHub Pages](#github-pages)
   - [Netlify Functions](#netlify-functions)
   - [Build Process](#build-process)
10. [URL Routing](#url-routing)
    - [Clean URL Implementation](#clean-url-implementation)
    - [Redirects](#redirects)
11. [Responsive Design](#responsive-design)
    - [Mobile Optimization](#mobile-optimization)
    - [Tailwind Implementation](#tailwind-implementation)
12. [Third-Party Libraries](#third-party-libraries)
    - [UI Libraries](#ui-libraries)
    - [Functionality Libraries](#functionality-libraries)
13. [Potential Issues and Solutions](#potential-issues-and-solutions)
    - [Performance Considerations](#performance-considerations)
    - [Security Concerns](#security-concerns)
    - [Scalability Challenges](#scalability-challenges)
14. [Future Enhancements](#future-enhancements)
15. [Development Workflow](#development-workflow)

## Project Overview

Brew and Clay is an e-commerce platform specializing in artisan mugs and pottery products. The project combines modern web technologies to create a seamless shopping experience for customers interested in high-quality, handcrafted ceramic products. The application follows a hybrid architecture, with a static frontend hosted on GitHub Pages and dynamic backend functionality provided through Netlify Functions and MongoDB.

The platform offers a complete e-commerce experience including product browsing, filtering, user authentication, shopping cart management, wishlists, and checkout functionality. The design emphasizes aesthetics and usability, reflecting the artisanal nature of the products being sold.

## Architecture

### Frontend Architecture

The frontend of Brew and Clay follows a multi-page application (MPA) approach rather than a single-page application (SPA). This architecture choice offers several advantages for an e-commerce site:

1. **Better SEO performance**: Each page has its own URL and content, making it more discoverable by search engines.
2. **Simpler implementation**: No need for complex client-side routing libraries.
3. **Faster initial page load**: Each page loads only what it needs.

The frontend is built with HTML, CSS (via Tailwind), and vanilla JavaScript. The application uses a modular JavaScript approach with several key modules:

```javascript
// Example of modular pattern from main.js
const BrewAndClay = (function () {
  // Private variables
  let cart = [];

  // Public methods
  return {
    initCart,
    addToCart,
    removeFromCart,
    // Other public methods
  };
})();
```

This pattern encapsulates functionality and prevents global namespace pollution while still allowing for organized code structure.

### Backend Architecture

The backend follows a dual implementation approach:

1. **Development Environment**: A traditional Express.js server (server.js) for local development and testing.
2. **Production Environment**: Serverless functions via Netlify Functions for the deployed application.

This approach allows for easy local development while leveraging the benefits of serverless architecture in production (scalability, reduced maintenance, cost-effectiveness).

The backend handles:

- User authentication and authorization
- Cart and wishlist management
- Data persistence via MongoDB

### Database Design

MongoDB serves as the database, with Mongoose as the ODM (Object Document Mapper). The database schema includes several key collections:

1. **Users**: Stores user account information including credentials and profile data.
2. **Carts**: Stores shopping cart data linked to user accounts.
3. **Wishlists**: Stores product wishlists for registered users.

Each schema includes validation rules to ensure data integrity:

```javascript
// Example from User.js model
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
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  // Other fields with validation
});
```

## Frontend Implementation

### Page Structure

The application consists of several HTML pages, each serving a specific purpose:

1. **Home.html**: Landing page showcasing featured products and brand story.
2. **AllProducts.html**: Product catalog with filtering options.
3. **ProductView.html**: Detailed view of individual products.
4. **Cart.html**: Shopping cart management.
5. **Checkout.html**: Order placement and shipping information.
6. **Login.html** & **SignUp.html**: User authentication pages.
7. **AboutUs.html**: Company information and brand story.
8. **Collections.html**: Categorized product collections.
9. **Wishlist.html**: User's saved products for future consideration.

Each page follows a consistent structure with shared components:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Meta tags, title, CSS links -->
  </head>
  <body class="font-['DM_Sans'] bg-gray-50">
    <header>
      <!-- Navigation bar -->
    </header>
    <main class="pt-16">
      <!-- Page-specific content -->
    </main>
    <footer>
      <!-- Footer content -->
    </footer>
    <!-- JavaScript imports -->
  </body>
</html>
```

### UI Components

The UI is built with Tailwind CSS, providing a responsive and modern design system. Key UI components include:

1. **Navigation Bar**: Fixed-position header with logo, navigation links, search bar, and action icons (wishlist, account, cart).

```html
<header class="fixed w-full bg-white shadow-sm z-50">
  <nav class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Navigation content -->
  </nav>
</header>
```

2. **Product Cards**: Consistent display of products with image, name, price, and action buttons.

3. **Filter Sidebar**: Category, price range, and attribute filters for product listings.

4. **Carousels**: Implemented using Glide.js for testimonials and featured products.

```html
<div class="glide">
  <div class="glide__track" data-glide-el="track">
    <ul class="glide__slides">
      <!-- Carousel items -->
    </ul>
  </div>
  <div class="glide__bullets" data-glide-el="controls[nav]">
    <!-- Carousel navigation -->
  </div>
</div>
```

5. **Form Components**: Styled input fields, checkboxes, and buttons for user interaction.

### Client-Side Functionality

The frontend JavaScript is organized into several modules, each handling specific functionality:

1. **main.js**: Core application logic and initialization.

```javascript
// Initialization example from main.js
document.addEventListener("DOMContentLoaded", function () {
  // Initialize modules
  BrewAndClay.init();

  // Set up event listeners
  setupEventListeners();
});
```

2. **database.js**: Client-side product database for development and fallback.

```javascript
// Product database structure
const products = [
  {
    id: "mug-001",
    name: "Classic White Mug",
    price: 774.69,
    description: "Minimalist design perfect for everyday use",
    category: "Minimalist Series",
    image: "../MugImages/1.png",
    featured: true,
    inStock: true,
  },
  // More products
];
```

3. **cart.js**: Shopping cart management including add, remove, update operations.

4. **wishlist.js**: Wishlist functionality for registered users.

5. **login.js** & **signup.js**: Authentication form handling and validation.

6. **ui.js**: UI-related functionality like modal dialogs, notifications, and dynamic content rendering.

The client-side code handles several key aspects:

- **State Management**: Managing application state (cart contents, user login status) using localStorage and sessionStorage.
- **DOM Manipulation**: Dynamically updating the UI based on user actions and data changes.
- **Form Validation**: Client-side validation before submitting data to the server.
- **API Integration**: Communicating with backend APIs for data persistence.

## Backend Implementation

### Express Server

The Express server (server.js) provides a traditional Node.js backend for local development:

```javascript
// server.js structure
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import routes
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```

The server provides API endpoints for user management, cart operations, and wishlist functionality. It connects to MongoDB for data persistence and serves static files for the frontend.

### Serverless Functions

For production, the application uses Netlify Functions to provide serverless backend functionality. The main API function is defined in `netlify/functions/api.js`:

```javascript
// netlify/functions/api.js structure
const express = require("express");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Database connection function
async function connectToDatabase() {
  // Connection logic
}

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());

// Define routes directly in the function
app.post("/users/register", async (req, res) => {
  // Registration logic
});

app.post("/users/login", async (req, res) => {
  // Login logic
});

// More route handlers

// Connect to database before handling request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Export the serverless handler
module.exports.handler = serverless(app);
```

The serverless function replicates the Express server functionality but is optimized for the serverless environment. It includes all the necessary route handlers and database connection logic within a single file.

### API Endpoints

The backend provides several API endpoints for client-server communication:

#### User Management

- **POST /api/users/register**: Register a new user
- **POST /api/users/login**: Authenticate a user and generate JWT
- **GET /api/users/profile**: Get the current user's profile (protected)
- **PUT /api/users/profile**: Update user profile (protected)

#### Cart Management

- **GET /api/cart**: Get the current user's cart (protected)
- **POST /api/cart**: Add an item to the cart (protected)
- **PUT /api/cart/:productId**: Update cart item quantity (protected)
- **DELETE /api/cart/:productId**: Remove an item from the cart (protected)
- **DELETE /api/cart**: Clear the entire cart (protected)

#### Wishlist Management

- **GET /api/wishlist**: Get the current user's wishlist (protected)
- **POST /api/wishlist**: Add an item to the wishlist (protected)
- **DELETE /api/wishlist/:productId**: Remove an item from the wishlist (protected)

Each endpoint includes appropriate validation, error handling, and authentication checks.

## Authentication System

### User Registration

The registration process follows these steps:

1. **Client-Side Validation**: The signup.js script validates form inputs before submission.

```javascript
// Example from signup.js
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  // Validate Egyptian phone number (01XXXXXXXXX)
  return /^01\d{9}$/.test(phone);
}
```

2. **Server-Side Validation**: The userRoutes.js handler validates the request data.

```javascript
// From userRoutes.js
router.post("/register", async (req, res) => {
  try {
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
      password, // Will be hashed by pre-save hook
    });

    // Return user data with JWT token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    // Error handling
  }
});
```

3. **Password Hashing**: The User model includes a pre-save hook to hash passwords.

```javascript
// From User.js model
userSchema.pre("save", async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password")) return next();

  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```

4. **JWT Generation**: Upon successful registration, a JWT token is generated for immediate authentication.

### Login Process

The login process follows these steps:

1. **Client-Side Validation**: The login.js script validates form inputs.

```javascript
// From login.js
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Validate all fields
  const isEmailValid = showError(
    emailInput,
    emailError,
    validateEmail(emailInput.value)
  );
  const isPasswordValid = showError(
    passwordInput,
    passwordError,
    validatePassword(passwordInput.value)
  );

  if (isEmailValid && isPasswordValid) {
    try {
      // Send login request
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value,
        }),
      });

      // Handle response
      // Store user data and redirect on success
    } catch (error) {
      // Error handling
    }
  }
});
```

2. **Server-Side Authentication**: The server verifies credentials and generates a JWT token.

```javascript
// From userRoutes.js
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isPasswordCorrect = await user.correctPassword(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return user data with JWT token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    // Error handling
  }
});
```

3. **Client-Side Storage**: The JWT token and user data are stored in localStorage for persistent authentication.

```javascript
// From login.js
const data = await response.json();
localStorage.setItem("brewAndClayUser", JSON.stringify(data));
```

### JWT Implementation

JSON Web Tokens (JWT) are used for stateless authentication:

1. **Token Generation**: When a user registers or logs in, a JWT is generated with the user's ID as the payload.

```javascript
// From userRoutes.js
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};
```

2. **Token Verification**: Protected routes use middleware to verify the JWT before granting access.

```javascript
// From authMiddleware.js
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
    // Error handling
  }
};
```

3. **Client-Side Usage**: The JWT is included in the Authorization header for API requests.

```javascript
// Example from cart.js
const response = await fetch(`${API_URL}/cart`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.token}`,
  },
});
```

## Shopping Cart Implementation

### Cart Data Structure

The cart is implemented with both client-side and server-side components:

1. **Client-Side Cart**: Stored in sessionStorage for guest users and as a cache for logged-in users.

```javascript
// From cart.js
const cart = [
  {
    id: "mug-001",
    name: "Classic White Mug",
    price: 774.69,
    image: "../MugImages/1.png",
    quantity: 2,
  },
  // More items
];
```

2. **Server-Side Cart**: Stored in MongoDB for registered users.

```javascript
// From Cart.js model
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
```

### Cart Operations

The cart supports several operations:

1. **Add to Cart**: Add a product to the cart or increment quantity if it already exists.

```javascript
// Client-side implementation from cart.js
const addToCart = (product) => {
  // Get quantity from product object or input
  let quantity = product.quantity || 1;

  // Check if product already exists in cart
  const existingItemIndex = cart.findIndex((item) => item.id === product.id);

  if (existingItemIndex >= 0) {
    // Add the new quantity to existing quantity
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new product to cart with specified quantity
    cart.push({
      ...product,
      quantity: quantity,
    });
  }

  // Save cart and update UI
  saveCart();
  updateCartCounter();
};
```

2. **Remove from Cart**: Remove a product from the cart.

```javascript
// Client-side implementation from cart.js
const removeFromCart = (productId) => {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  updateCartCounter();
};
```

3. **Update Quantity**: Change the quantity of a product in the cart.

```javascript
// Client-side implementation from cart.js
const updateCartItemQuantity = (productId, quantity) => {
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      removeFromCart(productId);
    } else {
      // Update quantity
      cart[itemIndex].quantity = quantity;
      saveCart();
      updateCartCounter();
    }
  }
};
```

4. **Clear Cart**: Remove all items from the cart.

```javascript
// Client-side implementation from cart.js
const clearCart = () => {
  cart = [];
  saveCart();
  updateCartCounter();
};
```

### Session vs. Server Storage

The cart implementation uses a hybrid approach:

1. **Guest Users**: Cart data is stored in sessionStorage only.

```javascript
// From cart.js
const saveCart = () => {
  sessionStorage.setItem("brewAndClayCart", JSON.stringify(cart));
};
```

2. **Logged-in Users**: Cart data is stored both in sessionStorage (for quick access) and on the server (for persistence).

```javascript
// From cart.js
const saveCart = async () => {
  // Save to session storage for both logged in and guest users as backup
  sessionStorage.setItem("brewAndClayCart", JSON.stringify(cart));

  // If logged in, also save to server
  if (isLoggedIn && user && user.token) {
    try {
      // API calls to sync with server
      // ...
    } catch (error) {
      console.error("Error saving cart to server:", error);
    }
  }
};
```

3. **Synchronization**: When a user logs in, the client-side cart is merged with the server-side cart.

```javascript
// From cart.js
const mergeCartsAfterLogin = async () => {
  // Get local cart
  const localCart = JSON.parse(
    sessionStorage.getItem("brewAndClayCart") || "[]"
  );

  if (localCart.length === 0) {
    // If local cart is empty, just load from server
    await initCart();
    return;
  }

  // If local cart has items, merge with server cart
  try {
    // API calls to merge carts
    // ...
  } catch (error) {
    console.error("Error merging carts:", error);
  }
};
```

## Product Management

### Product Data Structure

Products are defined with a comprehensive data structure:

```javascript
// From database.js
const products = [
  {
    id: "mug-001",
    name: "Classic White Mug",
    price: 774.69,
    description: "Minimalist design perfect for everyday use",
    category: "Minimalist Series",
    image: "../MugImages/1.png",
    featured: true,
    inStock: true,
  },
  // More products
];
```

Each product includes:

- Unique identifier
- Name and description
- Price
- Category/collection
- Image path
- Featured status (for homepage display)
- Stock status

### Product Display

Products are displayed in several formats throughout the site:

1. **Product Cards**: Used in the shop page and collections page.

```html
<div class="bg-white rounded-lg shadow-sm overflow-hidden group">
  <div class="relative">
    <img
      src="../MugImages/1.png"
      alt="Classic White Mug"
      class="w-full h-64 object-cover"
    />
    <div
      class="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
    >
      <button
        class="bg-white text-custom p-2 rounded-full mx-1 hover:bg-custom hover:text-white transition-colors"
      >
        <i class="far fa-heart"></i>
      </button>
      <button
        class="bg-white text-custom p-2 rounded-full mx-1 hover:bg-custom hover:text-white transition-colors"
      >
        <i class="fas fa-shopping-bag"></i>
      </button>
    </div>
  </div>
  <div class="p-4">
    <h3 class="text-lg font-medium text-gray-900">Classic White Mug</h3>
    <p class="text-custom font-medium mt-1">EGP 774.69</p>
  </div>
</div>
```

2. **Featured Products**: Highlighted on the homepage with additional styling.

3. **Product Detail View**: Comprehensive display in the ProductView.html page.

```html
<div class="lg:col-span-6">
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <img
      src="../MugImages/1.png"
      alt="Classic White Mug"
      class="w-full h-auto"
    />
  </div>
</div>
<div class="lg:col-span-6">
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h1 class="text-3xl font-bold text-gray-900">Classic White Mug</h1>
    <p class="text-2xl font-medium text-custom mt-2">EGP 774.69</p>
    <div class="mt-4 border-t border-b py-4">
      <p class="text-gray-600">Minimalist design perfect for everyday use</p>
    </div>
    <!-- Quantity selector and buttons -->
  </div>
</div>
```

### Product Filtering

The AllProducts.html page includes filtering functionality for product discovery:

1.
