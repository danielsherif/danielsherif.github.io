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

  // Create mobile menu button
  const createMobileMenuButton = () => {
    const header = document.querySelector("header nav .flex.justify-between");
    if (!header) return;

    // Create mobile menu button
    const mobileMenuButton = document.createElement("button");
    mobileMenuButton.className =
      "mobile-menu-button md:hidden p-2 text-gray-500 hover:text-custom";
    mobileMenuButton.setAttribute("aria-label", "Toggle mobile menu");
    mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';

    // Insert button before the search input container
    const searchContainer = header.querySelector(
      ".flex.items-center:last-child"
    );
    if (searchContainer) {
      searchContainer.prepend(mobileMenuButton);
    }
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

    // Add icons section (cart, user, etc.)
    const iconSection = document.createElement("div");
    iconSection.className =
      "border-t border-gray-200 py-3 px-4 flex justify-around";

    // Clone icon buttons
    const iconButtons = document.querySelector(
      ".hidden.md\\:ml-4.md\\:flex.md\\:items-center.md\\:space-x-4"
    );
    if (iconButtons) {
      const buttons = iconButtons.querySelectorAll("button");
      buttons.forEach((button) => {
        const mobileButton = button.cloneNode(true);
        mobileButton.className = "p-2 text-gray-500 hover:text-custom";
        iconSection.appendChild(mobileButton);
      });
    } else {
      // Create default buttons if none exist
      iconSection.innerHTML = `
        <button class="p-2 text-gray-500 hover:text-custom">
          <i class="far fa-heart"></i>
        </button>
        <button class="p-2 text-gray-500 hover:text-custom">
          <i class="far fa-user"></i>
        </button>
        <button class="p-2 text-gray-500 hover:text-custom relative">
          <i class="fas fa-shopping-bag"></i>
          <span class="absolute -top-1 -right-1 bg-custom text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"></span>
        </button>
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
      const mobileButtons = mobileMenu.querySelectorAll("button");
      mobileButtons.forEach((button) => {
        if (button.querySelector(".fa-shopping-bag")) {
          button.addEventListener("click", () => {
            window.location.href = "Cart.html";
          });
        } else if (button.querySelector(".fa-user")) {
          button.addEventListener("click", () => {
            window.location.href = "SignUp.html";
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
