// Brew & Clay - Mobile Products Page Enhancement

const BrewAndClayMobileProducts = (function () {
  // Initialize mobile-specific enhancements for products page
  const initMobileProductsPage = () => {
    // Only run on the AllProducts page
    if (!window.location.pathname.includes("AllProducts.html")) return;

    createMobileSearchAndFilterToggle();
    setupEventListeners();
  };

  // Create mobile-friendly search and filter toggle
  const createMobileSearchAndFilterToggle = () => {
    // Check if we're on a mobile device
    if (window.innerWidth >= 768) return;

    const mainContent = document.querySelector(
      ".max-w-8xl.mx-auto.px-4.sm:px-6.lg:px-8.py-16.mt-16"
    );
    if (!mainContent) return;

    // Create a container for mobile search and filter toggle
    const mobileControlsContainer = document.createElement("div");
    mobileControlsContainer.className =
      "mobile-products-controls md:hidden flex flex-col space-y-4 bg-white p-4 mb-4 rounded-lg shadow-sm sticky top-16 z-50";
    mobileControlsContainer.style.maxHeight = "calc(100vh - 4rem)";
    mobileControlsContainer.style.overflowY = "auto";

    // Create search bar for mobile
    const searchContainer = document.createElement("div");
    searchContainer.className = "relative w-full";
    searchContainer.innerHTML = `
      <input type="text" placeholder="Search products..." class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-button focus:outline-none focus:border-custom" />
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i class="fas fa-search text-gray-400"></i>
      </div>
    `;

    // Create filter toggle button
    const filterToggleButton = document.createElement("button");
    filterToggleButton.className =
      "filter-toggle-btn bg-custom text-white py-2 px-4 rounded-button flex items-center justify-center w-full";
    filterToggleButton.innerHTML = '<i class="fas fa-filter mr-2"></i> Filters';

    // Add elements to container
    mobileControlsContainer.appendChild(searchContainer);
    mobileControlsContainer.appendChild(filterToggleButton);

    // Find the filter section
    const filterSection = document.querySelector(".lg:col-span-3");
    if (filterSection) {
      // Add mobile-specific classes to filter section
      filterSection.classList.add("mobile-filter-section");
      // Initially hide the filter section on mobile
      if (window.innerWidth < 768) {
        filterSection.style.display = "none";
      }
    }

    // Insert the mobile controls before the grid container
    const gridContainer = document.querySelector(
      ".lg:grid.lg:grid-cols-12.lg:gap-8"
    );
    if (gridContainer) {
      gridContainer.parentNode.insertBefore(
        mobileControlsContainer,
        gridContainer
      );
    }

    // Setup search functionality
    const searchInput = searchContainer.querySelector("input");
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
  };

  // Setup event listeners
  const setupEventListeners = () => {
    // Toggle filter section visibility when filter button is clicked
    document.addEventListener("click", function (e) {
      if (e.target.closest(".filter-toggle-btn")) {
        const filterSection = document.querySelector(".mobile-filter-section");
        if (filterSection) {
          if (filterSection.style.display === "none") {
            filterSection.style.display = "block";
            e.target.closest(".filter-toggle-btn").innerHTML =
              '<i class="fas fa-times mr-2"></i> Close';
          } else {
            filterSection.style.display = "none";
            e.target.closest(".filter-toggle-btn").innerHTML =
              '<i class="fas fa-filter mr-2"></i> Filters';
          }
        }
      }
    });

    // Handle window resize
    window.addEventListener("resize", function () {
      const filterSection = document.querySelector(".mobile-filter-section");
      if (filterSection) {
        if (window.innerWidth >= 768) {
          filterSection.style.display = "block";
        } else {
          // Keep it hidden on mobile unless toggled
          if (
            !document.querySelector(".filter-toggle-btn") ||
            !document
              .querySelector(".filter-toggle-btn")
              .innerHTML.includes("Close")
          ) {
            filterSection.style.display = "none";
          }
        }
      }
    });
  };

  // Public methods
  return {
    init: function () {
      // Initialize when DOM is loaded
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initMobileProductsPage);
      } else {
        initMobileProductsPage();
      }
    },
  };
})();

// Initialize mobile products page enhancements
BrewAndClayMobileProducts.init();
