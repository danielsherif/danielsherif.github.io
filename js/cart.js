// Brew & Clay - Cart Module

const BrewAndClayCart = (function () {
  // Private variables
  let cart = [];
  let isLoggedIn = false;
  let user = null;
  const API_URL = "https://sweet-cobbler-5c0ef9.netlify.app/api";

  // Check if user is logged in
  const checkLoginStatus = () => {
    const userData = localStorage.getItem("brewAndClayUser");
    if (userData) {
      try {
        user = JSON.parse(userData);
        isLoggedIn = true;
        return true;
      } catch (e) {
        console.error("Error parsing user data:", e);
        localStorage.removeItem("brewAndClayUser");
      }
    }
    isLoggedIn = false;
    return false;
  };

  // Load cart from session storage or server
  const initCart = async () => {
    // First check if user is logged in
    if (checkLoginStatus()) {
      // If logged in, try to fetch cart from server
      try {
        const response = await fetch(`${API_URL}/cart`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          cart = data.items || [];
          console.log("Cart loaded from server:", cart);
          updateCartCounter(); // Ensure counter is updated after loading
        } else {
          console.error("Failed to fetch cart from server");
          // If server fetch fails, try to use session storage as fallback
          loadCartFromSessionStorage();
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        // If fetch fails, try to use session storage as fallback
        loadCartFromSessionStorage();
      }
    } else {
      // If not logged in, load from session storage
      loadCartFromSessionStorage();
    }
  };

  // Load cart from session storage
  const loadCartFromSessionStorage = () => {
    const savedCart = sessionStorage.getItem("brewAndClayCart");
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
        console.log("Cart loaded from session storage:", cart);
      } catch (e) {
        console.error("Error parsing cart from session storage:", e);
        cart = [];
        sessionStorage.removeItem("brewAndClayCart");
      }
    } else {
      console.log("No cart found in session storage");
      cart = [];
      sessionStorage.setItem("brewAndClayCart", JSON.stringify(cart));
    }
  };

  // Save cart to session storage and/or server
  const saveCart = async () => {
    // Save to session storage for both logged in and guest users as backup
    sessionStorage.setItem("brewAndClayCart", JSON.stringify(cart));

    // If logged in, also save to server
    if (isLoggedIn && user && user.token) {
      try {
        // First clear the server cart
        await fetch(`${API_URL}/cart`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        // Then add each item to the server cart
        for (const item of cart) {
          await fetch(`${API_URL}/cart`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              productId: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity,
            }),
          });
        }
      } catch (error) {
        console.error("Error saving cart to server:", error);
      }
    }
  };

  // Update the cart counter in the UI
  const updateCartCounter = () => {
    // Select all cart counter spans inside shopping bag buttons
    const cartCounters = document.querySelectorAll(
      ".fas.fa-shopping-bag + span, .cart-counter"
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
    // Get quantity from product object or input if available
    let quantity = product.quantity || 1;

    // If quantity not in product object, try to get from input
    if (!product.quantity) {
      const quantityInput = document.querySelector(".quantity-input");
      quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex >= 0) {
      // Add the new quantity to existing quantity
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart with specified quantity
      cart.push({
        id: product.id,
        name: product.name || "Unknown Product", // Ensure name is assigned
        price: parseFloat(product.price) || 0,
        image: product.image,
        quantity: quantity,
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
    // Quantity controls
    const quantityInput = document.querySelector(".quantity-input");
    const decreaseBtn = document.querySelector(".quantity-decrease");
    const increaseBtn = document.querySelector(".quantity-increase");

    if (quantityInput) {
      // Disable mouse wheel and keyboard arrows
      quantityInput.addEventListener("wheel", (e) => e.preventDefault());
      quantityInput.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
        }
      });

      // Set min value
      quantityInput.min = 1;
    }

    if (decreaseBtn) {
      decreaseBtn.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value) || 1;
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
        }
      });
    }

    if (increaseBtn) {
      increaseBtn.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value) || 1;
        quantityInput.value = currentValue + 1;
      });
    }

    // Add to cart buttons
    document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const productCard = this.closest(".product-card");
        if (productCard) {
          // Get quantity from input if available (for product cards that might have quantity inputs)
          const quantityInput = productCard.querySelector(".quantity-input");
          const quantity = quantityInput
            ? parseInt(quantityInput.value) || 1
            : 1;

          const product = {
            id: productCard.dataset.productId,
            name: productCard.querySelector(".product-name").textContent,
            price: parseFloat(
              productCard
                .querySelector(".product-price")
                .textContent.replace("EGP ", "")
            ),
            image: productCard.querySelector(".product-image").src,
            quantity: quantity, // Add quantity to the product object
          };

          addToCart(product);
        } else {
          // Handle product page add to cart
          const productName = document.querySelector(
            ".text-3xl.font-bold.text-gray-900"
          )?.textContent;
          const productPrice = parseFloat(
            document
              .querySelector(".text-2xl.font-bold.text-custom")
              ?.textContent.replace("EGP ", "")
          );
          const productImage = document.querySelector(
            ".aspect-w-1.aspect-h-1 img"
          )?.src;
          const productId = new URLSearchParams(window.location.search).get(
            "id"
          );

          if (productId && productName && productPrice && productImage) {
            // Get quantity from input if available
            const quantityInput = document.querySelector(".quantity-input");
            const quantity = quantityInput
              ? parseInt(quantityInput.value) || 1
              : 1;

            const product = {
              id: productId,
              name: productName,
              price: productPrice,
              image: productImage,
              quantity: quantity, // Add quantity to the product object
            };

            addToCart(product);
          }
        }
      });
    });
  };

  // Public API
  return {
    init: function () {
      initCart();
      initEventListeners();
      console.log("Brew & Clay cart initialized");
    },
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateCartItemQuantity: updateCartItemQuantity,
    getCart: () => [...cart],
    getCartTotal: calculateCartTotal,
    isUserLoggedIn: checkLoginStatus,
  };
})();

// Initialize the cart when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  BrewAndClayCart.init();
});
