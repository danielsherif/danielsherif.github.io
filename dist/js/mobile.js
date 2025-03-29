// Brew & Clay - Mobile Navigation Module

const BrewAndClayMobile = (function () {
  // Private variables
  let mobileMenuOpen = false;

  // Initialize mobile navigation
  const initMobileNavigation = () => {
    // Create mobile menu button if it doesn't exist
    if (!document.querySelector(".mobile-menu-button")) {
      createMobileMenuButton();
      createMobileMenu();
      setupEventListeners();
    }
  };

  // Create mobile menu button and cart icon for mobile
  const createMobileMenuButton = () => {
    const header = document.querySelector("header nav .flex.justify-between");
    if (!header) return;

    // Create a container for mobile controls
    const mobileControlsContainer = document.createElement("div");
    mobileControlsContainer.className = "md:hidden flex items-center space-x-2";

    // Create mobile menu button
    const mobileMenuButton = document.createElement("button");
    mobileMenuButton.className =
      "mobile-menu-button p-2 text-gray-500 hover:text-custom";
    mobileMenuButton.setAttribute("aria-label", "Toggle mobile menu");
    mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';

    // Add menu button to container
    mobileControlsContainer.appendChild(mobileMenuButton);

    // Create mobile cart button
    const mobileCartButton = document.createElement("button");
    mobileCartButton.className = "p-2 text-gray-500 hover:text-custom relative";
    mobileCartButton.setAttribute("aria-label", "View cart");
    mobileCartButton.innerHTML = `
      <i class="fas fa-shopping-bag"></i>
      <span class="absolute -top-1 -right-1 bg-custom text-white text-xs rounded-full h-4 w-4 flex items-center justify-center cart-counter"></span>
    `;

    // Add cart button to container (next to hamburger menu)
    mobileControlsContainer.appendChild(mobileCartButton);

    // Add event listener to cart button
    mobileCartButton.addEventListener("click", () => {
      window.location.href = "Cart.html";
    });

    // Make sure the counter is also clickable and leads to cart
    const cartCounter = mobileCartButton.querySelector(".cart-counter");
    if (cartCounter) {
      cartCounter.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent double triggering
        window.location.href = "Cart.html";
      });
    }

    // Insert container before the search input container
    const searchContainer = header.querySelector(
      ".flex.items-center:last-child"
    );
    if (searchContainer) {
      searchContainer.prepend(mobileControlsContainer);
    }

    // Update the cart counter in the UI
    const updateCartCounter = () => {
      // Select all cart counter spans inside shopping bag buttons
      const cartCounters = document.querySelectorAll(
        ".fas.fa-shopping-bag + span, .cart-counter"
      );
      if (cartCounters.length > 0) {
        // Get cart from session storage
        const savedCart = sessionStorage.getItem("brewAndClayCart");
        if (savedCart) {
          try {
            const cart = JSON.parse(savedCart);
            const itemCount = cart.reduce(
              (total, item) => total + item.quantity,
              0
            );
            cartCounters.forEach((counter) => {
              counter.textContent = itemCount;
              // Only display the counter if there are items in the cart
              counter.style.display = itemCount > 0 ? "flex" : "none";
            });
          } catch (e) {
            console.error("Error parsing cart from session storage:", e);
          }
        } else {
          // No cart found, hide counters
          cartCounters.forEach((counter) => {
            counter.textContent = "0";
            counter.style.display = "none";
          });
        }
      }
    };
  };

  // Create mobile menu
  const createMobileMenu = () => {
    const nav = document.querySelector("header nav");
    if (!nav) return;

    // Create mobile menu container
    const mobileMenu = document.createElement("div");
    mobileMenu.className =
      "mobile-menu hidden absolute top-16 left-0 w-full bg-white shadow-md z-50 md:hidden";

    // Clone navigation links
    const navLinks = document.querySelector(
      ".hidden.md\\:ml-6.md\\:flex.md\\:space-x-8"
    );
    if (navLinks) {
      const mobileNavLinks = document.createElement("div");
      mobileNavLinks.className = "py-2 px-4 space-y-2";

      // Clone and modify each link for mobile
      const links = navLinks.querySelectorAll("a");
      links.forEach((link) => {
        const mobileLink = link.cloneNode(true);
        mobileLink.className =
          "block py-2 px-4 text-gray-500 hover:text-custom hover:bg-gray-50";
        if (mobileLink.classList.contains("text-custom")) {
          mobileLink.className = "block py-2 px-4 text-custom bg-gray-50";
        }
        mobileNavLinks.appendChild(mobileLink);
      });

      mobileMenu.appendChild(mobileNavLinks);
    }

    // Add icons section (user, heart, etc. - NO CART)
    const iconSection = document.createElement("div");
    iconSection.className =
      "border-t border-gray-200 py-3 px-4 flex justify-around";

    // Clone icon buttons (excluding shopping bag for mobile)
    const iconButtons = document.querySelector(
      ".hidden.md\\:ml-4.md\\:flex.md\\:items-center.md\\:space-x-4"
    );
    if (iconButtons) {
      const buttons = iconButtons.querySelectorAll("button");
      buttons.forEach((button) => {
        // Skip the shopping bag button as we've added it to the header
        if (!button.querySelector(".fa-shopping-bag")) {
          const mobileButton = button.cloneNode(true);
          mobileButton.className = "p-2 text-gray-500 hover:text-custom";
          iconSection.appendChild(mobileButton);
        }
      });
    } else {
      // Create default buttons if none exist (excluding shopping bag)
      iconSection.innerHTML = `
        <a href="Wishlist.html" class="p-2 text-gray-500 hover:text-custom">
          <i class="far fa-heart"></i>
        </a>
        <a href="Login.html" class="p-2 text-gray-500 hover:text-custom">
          <i class="far fa-user"></i>
        </a>
      `;
    }
    mobileMenu.appendChild(iconSection);

    // Add search bar for mobile
    const searchSection = document.createElement("div");
    searchSection.className = "border-t border-gray-200 py-3 px-4";
    searchSection.innerHTML = `
      <div class="relative">
        <input type="text" placeholder="Search products..." class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-button focus:outline-none focus:border-custom" />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fas fa-search text-gray-400"></i>
        </div>
      </div>
    `;

    mobileMenu.appendChild(searchSection);

    // Append mobile menu to navigation
    nav.appendChild(mobileMenu);
  };

  // Setup event listeners
  const setupEventListeners = () => {
    // Toggle mobile menu
    const mobileMenuButton = document.querySelector(".mobile-menu-button");
    const mobileMenu = document.querySelector(".mobile-menu");

    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener("click", () => {
        mobileMenuOpen = !mobileMenuOpen;

        // Toggle menu visibility
        if (mobileMenuOpen) {
          mobileMenu.classList.remove("hidden");
          mobileMenuButton.innerHTML = '<i class="fas fa-times text-xl"></i>';
        } else {
          mobileMenu.classList.add("hidden");
          mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
        }
      });

      // Setup mobile menu button clicks
      const mobileButtons = mobileMenu.querySelectorAll("button, a");
      mobileButtons.forEach((button) => {
        // Skip anchor tags as they already have href attributes
        if (button.tagName.toLowerCase() === "a") {
          return;
        }

        // Handle button clicks
        if (button.querySelector(".fa-user")) {
          button.addEventListener("click", () => {
            window.location.href = "Login.html";
          });
        }
      });

      // Setup search functionality
      const searchInput = mobileMenu.querySelector(
        'input[placeholder="Search products..."]'
      );
      if (searchInput) {
        searchInput.addEventListener("keypress", function (e) {
          if (e.key === "Enter") {
            const searchTerm = this.value.trim();
            if (searchTerm) {
              window.location.href = `AllProducts.html?search=${encodeURIComponent(
                searchTerm
              )}`;
            }
          }
        });
      }
    }
  };

  // Adjust layout for mobile devices
  const adjustForMobile = () => {
    // Make search bar responsive
    const searchInputs = document.querySelectorAll(
      'input[placeholder="Search products..."]'
    );
    searchInputs.forEach((input) => {
      const container = input.closest(".relative");
      if (container && container.parentElement) {
        container.parentElement.classList.add("hidden", "md:block");
      }
    });

    // Adjust grid layouts for mobile
    const adjustGrids = () => {
      // Ensure product grids look good on mobile
      const productGrids = document.querySelectorAll(
        ".grid.grid-cols-1.md\\:grid-cols-3"
      );
      productGrids.forEach((grid) => {
        // Add gap for mobile
        grid.classList.add("gap-y-6");
      });

      // Adjust special offer section for mobile
      const specialOfferSections = document.querySelectorAll(
        ".grid.lg\\:grid-cols-2"
      );
      specialOfferSections.forEach((section) => {
        // Center text on mobile
        const textDiv = section.querySelector("div:first-child");
        if (textDiv) {
          textDiv.classList.add("text-center", "lg:text-left");
        }
      });
    };

    adjustGrids();
  };

  // Public methods
  return {
    init: function () {
      initMobileNavigation();
      adjustForMobile();

      // Update cart counter on initialization
      // This ensures the cart counter is properly displayed when the page loads
      const cartCounters = document.querySelectorAll(".cart-counter");
      if (cartCounters.length > 0) {
        // Get cart from session storage
        const savedCart = sessionStorage.getItem("brewAndClayCart");
        if (savedCart) {
          try {
            const cart = JSON.parse(savedCart);
            const itemCount = cart.reduce(
              (total, item) => total + item.quantity,
              0
            );
            cartCounters.forEach((counter) => {
              counter.textContent = itemCount;
              counter.style.display = itemCount > 0 ? "flex" : "none";
            });
          } catch (e) {
            console.error("Error parsing cart from session storage:", e);
          }
        }
      }

      // Handle window resize
      window.addEventListener("resize", function () {
        // Close mobile menu if screen size changes to desktop
        if (window.innerWidth >= 768 && mobileMenuOpen) {
          const mobileMenu = document.querySelector(".mobile-menu");
          const mobileMenuButton = document.querySelector(
            ".mobile-menu-button"
          );

          if (mobileMenu && mobileMenuButton) {
            mobileMenu.classList.add("hidden");
            mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            mobileMenuOpen = false;
          }
        }
      });
    },
  };
})();

// Initialize mobile navigation when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  BrewAndClayMobile.init();
});
