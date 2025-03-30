// Brew & Clay - Wishlist Module

// Define API URL
const API_URL = "https://sweet-cobbler-5c0ef9.netlify.app/api";

const BrewAndClayWishlist = (function () {
  // Private variables
  let wishlist = [];
  let isLoggedIn = false;
  let user = null;

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

  // Load wishlist from localStorage if available (for guest mode)
  const initWishlist = async () => {
    // First check if user is logged in
    if (checkLoginStatus()) {
      // If logged in, try to fetch wishlist from server
      try {
        const response = await fetch(`${API_URL}/wishlist`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          wishlist = data.items || [];
          console.log("Wishlist loaded from server:", wishlist);
        } else {
          console.error("Failed to fetch wishlist from server");
          // If server fetch fails, try to use local storage as fallback
          loadWishlistFromLocalStorage();
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        // If fetch fails, try to use local storage as fallback
        loadWishlistFromLocalStorage();
      }
    } else {
      // If not logged in, load from local storage
      loadWishlistFromLocalStorage();
    }

    // Render wishlist UI
    renderWishlist();
  };

  // Load wishlist from localStorage
  const loadWishlistFromLocalStorage = () => {
    const savedWishlist = localStorage.getItem("brewAndClayWishlist");
    if (savedWishlist) {
      try {
        wishlist = JSON.parse(savedWishlist);
        console.log("Wishlist loaded from local storage:", wishlist);
      } catch (e) {
        console.error("Error parsing wishlist from local storage:", e);
        wishlist = [];
        saveWishlist();
      }
    } else {
      console.log("No wishlist found in local storage");
      wishlist = [];
    }
  };

  // Save wishlist to localStorage (for guest mode)
  const saveWishlist = async () => {
    // Save to localStorage for both logged in and guest users as backup
    localStorage.setItem("brewAndClayWishlist", JSON.stringify(wishlist));

    // If logged in, also save to server
    if (isLoggedIn && user && user.token) {
      try {
        // First clear the server wishlist
        await fetch(`${API_URL}/wishlist`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        // Then add each item to the server wishlist
        for (const item of wishlist) {
          await fetch(`${API_URL}/wishlist`, {
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
            }),
          });
        }
      } catch (error) {
        console.error("Error saving wishlist to server:", error);
      }
    }
  };

  // Add item to wishlist
  const addToWishlist = (product) => {
    // Check if user is logged in first
    if (!checkLoginStatus()) {
      // Redirect to login page if not logged in
      window.location.href = "Login.html";
      return;
    }

    // Check if product already exists in wishlist
    const existingItemIndex = wishlist.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex >= 0) {
      // Product already in wishlist, show notification
      showNotification(`${product.name} is already in your wishlist`);
      return;
    }

    // Add new product to wishlist
    wishlist.push({
      ...product,
    });

    // Save wishlist and show notification
    saveWishlist();
    showNotification(`${product.name} added to wishlist`);
  };

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    wishlist = wishlist.filter((item) => item.id !== productId);
    saveWishlist();
    renderWishlist(); // Re-render wishlist after update
  };

  // Move item from wishlist to cart
  const moveToCart = (productId) => {
    const item = wishlist.find((item) => item.id === productId);
    if (item) {
      // Add to cart
      BrewAndClay.addToCart(item);
      // Remove from wishlist
      removeFromWishlist(productId);
    }
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

  // Render wishlist items
  const renderWishlist = () => {
    const emptyWishlistElement = document.getElementById("empty-wishlist");
    const wishlistItemsElement = document.getElementById("wishlist-items");

    if (!emptyWishlistElement || !wishlistItemsElement) {
      return; // Not on wishlist page
    }

    // Check if user is logged in
    const isUserLoggedIn = checkLoginStatus();

    if (!isUserLoggedIn) {
      // Show login prompt for guests
      emptyWishlistElement.innerHTML = `
        <i class="far fa-user text-5xl text-gray-300 mb-4"></i>
        <h2 class="text-xl font-medium text-gray-900 mb-2">Please log in to view your wishlist</h2>
        <p class="text-gray-500 mb-6">Log in to save items to your wishlist and access them anytime.</p>
        <a href="Login.html" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium text-white bg-custom hover:bg-custom/90 rounded-button">
            Log In
            <i class="fas fa-arrow-right ml-2"></i>
        </a>
      `;
      emptyWishlistElement.classList.remove("hidden");
      wishlistItemsElement.classList.add("hidden");
      return;
    }

    // Check if wishlist is empty
    if (wishlist.length === 0) {
      // Show empty wishlist message
      emptyWishlistElement.innerHTML = `
        <i class="far fa-heart text-5xl text-gray-300 mb-4"></i>
        <h2 class="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h2>
        <p class="text-gray-500 mb-6">Save items you love to your wishlist and review them anytime.</p>
        <a href="AllProducts.html" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium text-white bg-custom hover:bg-custom/90 rounded-button">
            Continue Shopping
            <i class="fas fa-arrow-right ml-2"></i>
        </a>
      `;
      emptyWishlistElement.classList.remove("hidden");
      wishlistItemsElement.classList.add("hidden");
    } else {
      // Show wishlist items
      emptyWishlistElement.classList.add("hidden");
      wishlistItemsElement.classList.remove("hidden");

      // Clear existing content
      wishlistItemsElement.innerHTML = "";

      // Create a document fragment to improve performance
      const fragment = document.createDocumentFragment();

      // Render wishlist items
      wishlist.forEach((item) => {
        // Try to get the latest product data from database if available
        let productData = item;
        if (window.BrewAndClayDB && item.id) {
          const dbProduct = window.BrewAndClayDB.getProductById(item.id);
          if (dbProduct) {
            // Use database product data but keep the item ID from wishlist
            productData = {
              ...dbProduct,
              id: item.id, // Keep the original ID to ensure we can remove it
            };
          }
        }

        const wishlistItemElement = document.createElement("div");
        wishlistItemElement.className =
          "flex flex-col md:flex-row border-b border-gray-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0";
        wishlistItemElement.dataset.productId = productData.id; // Add product ID as data attribute
        wishlistItemElement.innerHTML = `
          <div class="md:w-1/4 mb-4 md:mb-0">
            <img src="${productData.image}" alt="${
          productData.name
        }" class="w-full h-auto rounded-lg" onerror="this.src='../MugImages/1.png'" />
          </div>
          <div class="md:w-3/4 md:pl-6 flex flex-col">
            <div class="flex justify-between mb-2">
              <h3 class="text-lg font-medium text-gray-900">${
                productData.name
              }</h3>
              <button class="text-gray-400 hover:text-red-500 remove-item-btn">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <p class="text-gray-500 mb-4">${productData.description || ""}</p>
            <div class="mt-auto flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span class="text-lg font-medium text-custom mb-4 sm:mb-0">EGP ${productData.price.toFixed(
                2
              )}</span>
              <div class="flex space-x-2">
                <button class="bg-custom text-white py-2 px-4 rounded-button hover:bg-custom/90 add-to-cart-btn">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        `;

        // Add event listener for remove button
        const removeBtn = wishlistItemElement.querySelector(".remove-item-btn");
        removeBtn.addEventListener("click", () => {
          removeFromWishlist(item.id);
        });

        // Add event listener for add to cart button
        const addToCartBtn =
          wishlistItemElement.querySelector(".add-to-cart-btn");
        addToCartBtn.addEventListener("click", () => {
          moveToCart(item.id);
        });

        fragment.appendChild(wishlistItemElement);
      });

      // Append all items at once
      wishlistItemsElement.appendChild(fragment);
    }
  };

  // Initialize event listeners
  const initEventListeners = () => {
    // Add to wishlist buttons (only the dedicated button in product view, not the icon in header)
    const addToWishlistBtn = document
      .querySelector(
        "button.w-full.border.border-custom i.far.fa-heart, button.w-full.border.border-custom i.fa-heart"
      )
      ?.closest("button");

    // Get the wishlist icon in the header
    const wishlistIcon = document.querySelector(
      "a[href='Wishlist.html'] .far.fa-heart"
    );

    // If we're on a page with the add to wishlist button
    if (addToWishlistBtn) {
      addToWishlistBtn.addEventListener("click", function () {
        // Check if user is logged in
        if (!checkLoginStatus()) {
          // Redirect to login page if not logged in
          window.location.href = "Login.html";
          return;
        }

        // Get product details from the page
        const productName = document.querySelector(
          ".text-3xl.font-bold.text-gray-900"
        )?.textContent;
        const productPrice = parseFloat(
          document
            .querySelector(".text-2xl.font-bold.text-custom")
            ?.textContent.replace("EGP ", "")
        );
        // Get the main product image (first image in the product view)
        const productImage = document.querySelector(
          ".aspect-w-1.aspect-h-1 img"
        )?.src;

        // If image is not found or is empty, try to get it from the database
        // Try to get product ID from URL parameters first
        let productId = new URLSearchParams(window.location.search).get("id");

        // If we have a product ID, try to get the product from the database
        let dbProduct = null;
        if (productId && window.BrewAndClayDB) {
          dbProduct = window.BrewAndClayDB.getProductById(productId);
        }

        // If no ID in URL, generate a unique ID based on product name
        if (!productId && productName) {
          productId = `product-${productName
            .toLowerCase()
            .replace(/\s+/g, "-")}-${Date.now()}`;
        }

        // If we have a product from the database, use that information
        if (dbProduct) {
          addToWishlist(dbProduct);
        }
        // Otherwise use the information from the page
        else if (productId && productName && productPrice && productImage) {
          const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage || "../MugImages/1.png", // Fallback image only if needed
          };

          addToWishlist(product);
        }
      });
    }

    // Make sure the wishlist icon in the header always navigates to the wishlist page
    if (wishlistIcon && wishlistIcon.parentElement) {
      // Ensure the parent link points to the wishlist page
      wishlistIcon.parentElement.href = "Wishlist.html";
    }
  };

  // Public API
  return {
    init: function () {
      initWishlist();
      initEventListeners();
      console.log("Brew & Clay wishlist initialized");
    },
    addToWishlist: addToWishlist,
    removeFromWishlist: removeFromWishlist,
    moveToCart: moveToCart,
    getWishlist: () => [...wishlist],
    isUserLoggedIn: checkLoginStatus,
  };
})();

// Initialize the wishlist when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  BrewAndClayWishlist.init();
});
