// Brew & Clay - Main JavaScript File

// Using a module pattern for better organization
const BrewAndClay = (function () {
  // Private variables
  let cart = [];

  // Load cart from session storage if available
  const initCart = () => {
    const savedCart = sessionStorage.getItem("brewAndClayCart");
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
        console.log("Cart loaded from session storage:", cart);
        updateCartCounter();
      } catch (e) {
        console.error("Error parsing cart from session storage:", e);
        cart = [];
        saveCart();
      }
    } else {
      console.log("No cart found in session storage");
      cart = [];
    }
  };

  // Save cart to session storage
  const saveCart = () => {
    sessionStorage.setItem("brewAndClayCart", JSON.stringify(cart));
  };

  // Update the cart counter in the UI
  const updateCartCounter = () => {
    // Select all cart counter spans inside shopping bag buttons
    const cartCounters = document.querySelectorAll(
      ".fas.fa-shopping-bag + span"
    );
    if (cartCounters.length > 0) {
      const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
      cartCounters.forEach((counter) => {
        counter.textContent = itemCount;
        // Only display the counter if there are items in the cart
        counter.style.display = itemCount > 0 ? "flex" : "none";
      });
    }
  };

  // Add item to cart
  const addToCart = (product) => {
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex >= 0) {
      // Increment quantity if product already in cart
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new product to cart
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    // Save cart and update UI
    saveCart();
    updateCartCounter();

    // Show notification
    showNotification(`${product.name} added to cart`);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    cart = cart.filter((item) => item.id !== productId);
    saveCart();
    updateCartCounter();
  };

  // Update item quantity in cart
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

  // Calculate cart total
  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Show notification
  const showNotification = (message) => {
    // Create notification element
    const notification = document.createElement("div");
    notification.className =
      "fixed top-4 right-4 bg-custom text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-all duration-500 translate-y-[-20px] opacity-0";
    notification.textContent = message;

    // Add to DOM
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.classList.remove("translate-y-[-20px]", "opacity-0");
    }, 10);

    // Remove after delay
    setTimeout(() => {
      notification.classList.add("translate-y-[-20px]", "opacity-0");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  };

  // Initialize event listeners
  const initEventListeners = () => {
    // Add to cart buttons
    document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const productCard = this.closest(".product-card");
        const product = {
          id: productCard.dataset.productId,
          name: productCard.querySelector(".product-name").textContent,
          price: parseFloat(
            productCard
              .querySelector(".product-price")
              .textContent.replace("EGP ", "")
          ),
          image: productCard.querySelector(".product-image").src,
        };

        addToCart(product);
      });
    });
  };

  // Public API
  return {
    init: function () {
      initCart();
      initEventListeners();
      console.log("Brew & Clay application initialized");
    },
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateCartItemQuantity: updateCartItemQuantity,
    getCart: () => [...cart],
    getCartTotal: calculateCartTotal,
  };
})();

// Initialize the application when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  BrewAndClay.init();
});
