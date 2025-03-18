// Brew & Clay - UI Module

const BrewAndClayUI = (function () {
  // Private variables
  const pages = {
    home: "Home.html",
    shop: "AllProducts.html",
    product: "ProductView.html",
    cart: "Cart.html",
    checkout: "Checkout.html",
    about: "AboutUs.html",
    signup: "SignUp.html",
  };

  // Initialize page-specific functionality
  const initPageSpecific = () => {
    const currentPage = window.location.pathname.split("/").pop();

    // Common initialization for all pages
    initNavigation();
    initSearch();

    // Page-specific initialization
    switch (currentPage) {
      case pages.home:
        initHomePage();
        break;
      case pages.shop:
        initShopPage();
        break;
      case pages.product:
        initProductPage();
        break;
      case pages.cart:
        initCartPage();
        break;
      case pages.checkout:
        initCheckoutPage();
        break;
      default:
        // Default initialization for other pages
        break;
    }
  };

  // Initialize navigation links
  const initNavigation = () => {
    // Update navigation links to point to the correct pages
    document
      .querySelectorAll(".hidden.md\\:ml-6.md\\:flex.md\\:space-x-8 a")
      .forEach((link) => {
        // Get the position of the link in the navigation
        const index = Array.from(link.parentNode.children).indexOf(link);
        const currentPage = window.location.pathname.split("/").pop();

        // Remove existing active classes from all links
        link.classList.remove("text-custom", "border-custom", "border-b-2");
        link.classList.add("text-gray-500", "hover:text-custom");

        // Set the correct text and href based on position
        if (index === 0) {
          link.href = pages.home;
          link.textContent = "Home";
          if (currentPage === pages.home) {
            link.classList.remove("text-gray-500");
            link.classList.add("text-custom", "border-custom", "border-b-2");
          }
        } else if (index === 1) {
          link.href = pages.shop;
          link.textContent = "Shop";
          if (currentPage === pages.shop) {
            link.classList.remove("text-gray-500");
            link.classList.add("text-custom", "border-custom", "border-b-2");
          }
        } else if (index === 2) {
          link.href = "Collections.html";
          link.textContent = "Collections";
          // Check if we're on the collections page
          if (currentPage === "Collections.html") {
            link.classList.remove("text-gray-500");
            link.classList.add("text-custom", "border-custom", "border-b-2");
          }
        } else if (index === 3) {
          link.href = pages.about;
          link.textContent = "About";
          if (currentPage === pages.about) {
            link.classList.remove("text-gray-500");
            link.classList.add("text-custom", "border-custom", "border-b-2");
          }
        }
      });

    // Fix navigation links that are set to '#'
    document.querySelectorAll("a[href='#']").forEach((link) => {
      const linkText = link.textContent.trim().toLowerCase();

      switch (linkText) {
        case "home":
          link.href = pages.home;
          break;
        case "shop":
          link.href = pages.shop;
          break;
        case "collections":
          link.href = "Collections.html";
          break;
        case "about":
          link.href = pages.about;
          break;
      }
    });

    // Initialize shopping cart link
    const cartButtons = document.querySelectorAll("button");
    const cartButton = Array.from(cartButtons).find((button) =>
      button.querySelector(".fa-shopping-bag")
    );
    if (cartButton) {
      cartButton.addEventListener("click", () => {
        window.location.href = pages.cart;
      });
    }
  };

  // Initialize search functionality
  const initSearch = () => {
    const searchInput = document.querySelector(
      'input[placeholder="Search products..."]'
    );
    if (searchInput) {
      searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          const searchTerm = this.value.trim();
          if (searchTerm) {
            window.location.href = `${pages.shop}?search=${encodeURIComponent(
              searchTerm
            )}`;
          }
        }
      });
    }
  };

  // Home page initialization
  const initHomePage = () => {
    // Shop Collection button - use more specific selector
    const shopButton = document.querySelector(
      "button:not(.add-to-cart-btn):not(.quantity-btn)"
    );
    if (
      shopButton &&
      shopButton.textContent.trim().includes("Shop Collection")
    ) {
      shopButton.addEventListener("click", () => {
        window.location.href = pages.shop;
      });
    }

    // Featured products
    const productCards = document.querySelectorAll(
      ".group.relative.rounded-lg"
    );

    // Process all cards at once
    if (productCards.length > 0) {
      productCards.forEach((card, index) => {
        // Add product ID data attribute
        const productId = `mug-00${index + 1}`;
        card.dataset.productId = productId;
        card.classList.add("product-card");

        // Update product image
        const imgElement = card.querySelector("img");
        if (imgElement) {
          imgElement.classList.add("product-image");
          // Check database for correct image path first
          const productId = `mug-00${index + 1}`;
          const product = BrewAndClayDB.getProductById(productId);

          if (product && product.image) {
            // Use the image path from the database
            imgElement.src = product.image;
          } else {
            // Fallback to default pattern with better extension handling
            // Use the correct extension for each image
            let fileExtension;
            if (index === 0 || index === 1) {
              fileExtension = ".png";
            } else if (index === 2) {
              fileExtension = ".JPG";
            } else if (index === 3 || index === 4) {
              fileExtension = ".JPG";
            } else {
              fileExtension = ".jpg";
            }
            imgElement.src = `../MugImages/${index + 1}${fileExtension}`;

            // Add error handling for image loading with multiple fallbacks
            imgElement.onerror = function () {
              // Try alternative extensions if first attempt fails
              const extensions = [".jpg", ".JPG", ".png", ".PNG"];
              let currentExtension = fileExtension;

              const tryNextExtension = () => {
                // Find the next extension to try
                const currentIndex = extensions.indexOf(currentExtension);
                const nextIndex = (currentIndex + 1) % extensions.length;
                currentExtension = extensions[nextIndex];

                // Try the next extension
                this.src = `../MugImages/${index + 1}${currentExtension}`;
              };

              tryNextExtension();
              // Set up another error handler for subsequent failures
              this.onerror = tryNextExtension;
            };
          }
        }

        // Update product name and price
        const nameElement = card.querySelector("h3");
        if (nameElement) {
          nameElement.classList.add("product-name");
        }

        const priceElement = card.querySelector("p");
        if (priceElement) {
          const priceText = priceElement.textContent.split("-")[0].trim();
          priceElement.classList.add("product-price");
          priceElement.textContent = priceText;
        }

        // Add to cart button
        const addToCartButton = card.querySelector("button");
        if (addToCartButton) {
          addToCartButton.classList.add("add-to-cart-btn");
          addToCartButton.addEventListener("click", function (e) {
            e.stopPropagation(); // Prevent event bubbling
            const product = BrewAndClayDB.getProductById(productId);
            if (product) {
              BrewAndClay.addToCart(product);
            }
          });
        }
      });
    }
  };

  // Shop page initialization
  const initShopPage = () => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get("search");
    const categoryFilter = urlParams.get("category");
    const collectionView = urlParams.get("view") === "collections";

    if (searchQuery) {
      // Handle search results
      displaySearchResults(searchQuery);
    } else if (categoryFilter) {
      // Handle category filtering
      displayCategoryProducts(categoryFilter);
    } else {
      // Display all products
      displayAllProducts();
    }

    // Initialize filter functionality
    initProductFilters();
  };

  // Initialize product filters
  const initProductFilters = () => {
    const filterContainer = document.querySelector(
      ".bg-white.p-6.rounded-lg.shadow-sm"
    );
    if (!filterContainer) return;

    // Get all filter checkboxes
    const filterCheckboxes = filterContainer.querySelectorAll(
      'input[type="checkbox"]'
    );

    // Get the Apply Filters button that's already in the HTML
    const applyButton = document.getElementById("apply-filters-btn");
    const clearButton = document.getElementById("clear-filters-btn");

    if (applyButton) {
      // Add click event listener to the Apply Filters button
      applyButton.addEventListener("click", () => {
        applyProductFilters();
      });
    }

    if (clearButton) {
      // Add click event listener to the Clear Filter button
      clearButton.addEventListener("click", () => {
        // Uncheck all filter checkboxes
        filterCheckboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });

        // Display all products
        displayAllProducts();
      });
    }

    // Initialize sorting functionality
    const initSorting = () => {
      const sortSelect = document.getElementById("product-sort");

      if (sortSelect) {
        sortSelect.addEventListener("change", () => {
          console.log("Sort dropdown changed to:", sortSelect.value);
          const selectedOption = sortSelect.value;
          const products = document.querySelectorAll(".product-card");
          const productsArray = Array.from(products);

          // Get all products to sort
          let allProducts = BrewAndClayDB.getAllProducts();

          // Check if we have filtered products
          const selectedCollections = getSelectedFilters("Collections");
          const selectedPriceRanges = getSelectedFilters("Price Range");
          const selectedColors = getSelectedFilters("Color");

          // Apply filters if any are selected
          if (
            selectedCollections.length > 0 ||
            selectedPriceRanges.length > 0 ||
            selectedColors.length > 0
          ) {
            // Apply the same filtering logic as in applyProductFilters
            if (selectedCollections.length > 0) {
              allProducts = allProducts.filter((product) =>
                selectedCollections.includes(product.category)
              );
            }

            if (selectedPriceRanges.length > 0) {
              console.log("Selected price ranges (sort):", selectedPriceRanges);
              allProducts = allProducts.filter((product) => {
                // Handle different price formats (string with $ or number)
                let price;
                if (typeof product.price === "string") {
                  // Remove currency symbol and any whitespace
                  price = parseFloat(product.price.replace(/[$\s,]/g, ""));
                  console.log(
                    `Parsed string price for ${product.name}: '${product.price}' -> ${price}`
                  );
                } else {
                  price = parseFloat(product.price);
                  console.log(
                    `Using numeric price for ${product.name}: ${price}`
                  );
                }

                // Check if price is valid
                if (isNaN(price)) {
                  console.error(
                    `Invalid price for ${product.name}: ${
                      product.price
                    } (${typeof product.price})`
                  );
                  return false;
                }

                return selectedPriceRanges.some((range) => {
                  let result = false;
                  if (range === "Under $25") result = price < 25;
                  if (range === "$25 - $50")
                    result = price >= 25 && price <= 50;
                  if (range === "$50+") result = price > 50;
                  console.log(
                    `Range: ${range}, Product: ${product.name}, Price: ${price}, Matches: ${result}`
                  );
                  return result;
                });
              });
            }

            if (selectedColors.length > 0) {
              allProducts = allProducts.filter((product) => {
                const productText = (
                  product.name +
                  " " +
                  product.description
                ).toLowerCase();
                return selectedColors.some((color) =>
                  productText.includes(color.toLowerCase())
                );
              });
            }
          }

          // Sort products based on selected option
          console.log("Sorting products by:", selectedOption);
          switch (selectedOption) {
            case "Featured":
              // No sorting needed, products are already in featured order
              break;
            case "Newest":
              // For demo purposes, we'll just reverse the order
              allProducts.reverse();
              break;
            case "Price: Low to High":
              allProducts.sort((a, b) => {
                // Handle different price formats consistently
                const priceA =
                  typeof a.price === "number"
                    ? a.price
                    : parseFloat(a.price.toString().replace(/[$\s,]/g, ""));
                const priceB =
                  typeof b.price === "number"
                    ? b.price
                    : parseFloat(b.price.toString().replace(/[$\s,]/g, ""));
                console.log(
                  `Sorting: ${a.name}(${priceA}) vs ${b.name}(${priceB})`
                );
                return priceA - priceB;
              });
              break;
            case "Price: High to Low":
              allProducts.sort((a, b) => {
                // Handle different price formats consistently
                const priceA =
                  typeof a.price === "number"
                    ? a.price
                    : parseFloat(a.price.toString().replace(/[$\s,]/g, ""));
                const priceB =
                  typeof b.price === "number"
                    ? b.price
                    : parseFloat(b.price.toString().replace(/[$\s,]/g, ""));
                console.log(
                  `Sorting: ${a.name}(${priceB}) vs ${b.name}(${priceA})`
                );
                return priceB - priceA;
              });
              break;
          }

          // Render the sorted products
          console.log("Rendering sorted products:", allProducts);
          renderProductGrid(allProducts);
        });
      }
    };

    // Initialize sorting
    initSorting();
  };

  // Apply product filters
  const applyProductFilters = () => {
    // Get all products
    const allProducts = BrewAndClayDB.getAllProducts();

    // Get selected filters
    const selectedCollections = getSelectedFilters("Collections");
    const selectedPriceRanges = getSelectedFilters("Price Range");
    const selectedColors = getSelectedFilters("Color");

    // Filter products based on selected criteria
    let filteredProducts = allProducts;

    // Filter by collection
    if (selectedCollections.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedCollections.includes(product.category)
      );
    }

    // Filter by price range - Fixed implementation with proper number parsing
    if (selectedPriceRanges.length > 0) {
      console.log("Selected price ranges:", selectedPriceRanges);
      console.log(
        "Products before price filtering:",
        filteredProducts.map((p) => ({
          name: p.name,
          price: p.price,
          type: typeof p.price,
        }))
      );

      filteredProducts = filteredProducts.filter((product) => {
        // Handle different price formats (string with $ or number)
        let price;
        if (typeof product.price === "string") {
          // Remove currency symbol and any whitespace
          price = parseFloat(product.price.replace(/[$\s,]/g, ""));
          console.log(
            `Parsed string price for ${product.name}: '${product.price}' -> ${price}`
          );
        } else {
          price = parseFloat(product.price);
          console.log(`Using numeric price for ${product.name}: ${price}`);
        }

        // Check if price is valid
        if (isNaN(price)) {
          console.error(
            `Invalid price for ${product.name}: ${
              product.price
            } (${typeof product.price})`
          );
          return false;
        }

        // Check if price matches any of the selected ranges
        return selectedPriceRanges.some((range) => {
          // Normalize the range string by removing extra whitespace and newlines
          const normalizedRange = range.replace(/\s+/g, " ").trim();

          let result = false;
          if (normalizedRange === "Under $25") result = price < 25;
          if (
            normalizedRange.includes("$25") &&
            normalizedRange.includes("$50")
          )
            result = price >= 25 && price <= 50;
          if (normalizedRange === "$50+") result = price > 50;

          console.log(
            `Range: ${range}, Normalized: ${normalizedRange}, Product: ${product.name}, Price: ${price}, Matches: ${result}`
          );
          return result;
        });
      });

      console.log(
        "Filtered products after price filtering:",
        filteredProducts.map((p) => p.name)
      );
    }

    // Filter by color (assuming color information is in the product name or description)
    if (selectedColors.length > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const productText = (
          product.name +
          " " +
          product.description
        ).toLowerCase();
        return selectedColors.some((color) =>
          productText.includes(color.toLowerCase())
        );
      });
    }

    // Apply current sorting if any
    const sortSelect = document.getElementById("product-sort");

    if (sortSelect && sortSelect.value !== "Featured") {
      const selectedOption = sortSelect.value;

      // Sort products based on selected option
      switch (selectedOption) {
        case "Newest":
          // For demo purposes, we'll just reverse the order
          filteredProducts.reverse();
          break;
        case "Price: Low to High":
          filteredProducts.sort((a, b) => {
            // Handle different price formats consistently
            const priceA =
              typeof a.price === "number"
                ? a.price
                : parseFloat(a.price.toString().replace(/[$\s,]/g, ""));
            const priceB =
              typeof b.price === "number"
                ? b.price
                : parseFloat(b.price.toString().replace(/[$\s,]/g, ""));
            console.log(
              `Sorting filtered: ${a.name}(${priceA}) vs ${b.name}(${priceB})`
            );
            return priceA - priceB;
          });
          break;
        case "Price: High to Low":
          filteredProducts.sort((a, b) => {
            // Handle different price formats consistently
            const priceA =
              typeof a.price === "number"
                ? a.price
                : parseFloat(a.price.toString().replace(/[$\s,]/g, ""));
            const priceB =
              typeof b.price === "number"
                ? b.price
                : parseFloat(b.price.toString().replace(/[$\s,]/g, ""));
            console.log(
              `Sorting filtered: ${a.name}(${priceB}) vs ${b.name}(${priceA})`
            );
            return priceB - priceA;
          });
          break;
      }
    }

    // Render filtered products
    renderProductGrid(filteredProducts);
  };

  // Get selected filters by category
  const getSelectedFilters = (category) => {
    const categoryHeader = Array.from(
      document.querySelectorAll(".font-medium.text-gray-700.mb-2")
    ).find((el) => el.textContent === category);

    if (!categoryHeader) return [];

    const filterContainer = categoryHeader.nextElementSibling;
    const selectedCheckboxes = filterContainer.querySelectorAll(
      'input[type="checkbox"]:checked'
    );

    return Array.from(selectedCheckboxes).map((checkbox) => {
      // Normalize the text content by replacing newlines and multiple spaces with a single space
      return checkbox.nextElementSibling.textContent
        .replace(/\s+/g, " ")
        .trim();
    });
  };

  // Display all products
  const displayAllProducts = () => {
    const products = BrewAndClayDB.getAllProducts();

    // Apply current sorting if any
    const sortSelect = document.getElementById("product-sort");

    if (sortSelect && sortSelect.value !== "Featured") {
      const selectedOption = sortSelect.value;
      let sortedProducts = [...products];

      // Sort products based on selected option
      switch (selectedOption) {
        case "Newest":
          // For demo purposes, we'll just reverse the order
          sortedProducts.reverse();
          break;
        case "Price: Low to High":
          sortedProducts.sort((a, b) => {
            // Handle different price formats consistently
            const priceA =
              typeof a.price === "number"
                ? a.price
                : parseFloat(a.price.toString().replace(/[$\s,]/g, ""));
            const priceB =
              typeof b.price === "number"
                ? b.price
                : parseFloat(b.price.toString().replace(/[$\s,]/g, ""));
            console.log(
              `Sorting all products: ${a.name}(${priceA}) vs ${b.name}(${priceB})`
            );
            return priceA - priceB;
          });
          break;
        case "Price: High to Low":
          sortedProducts.sort((a, b) => {
            // Handle different price formats consistently
            const priceA =
              typeof a.price === "number"
                ? a.price
                : parseFloat(a.price.toString().replace(/[$\s,]/g, ""));
            const priceB =
              typeof b.price === "number"
                ? b.price
                : parseFloat(b.price.toString().replace(/[$\s,]/g, ""));
            console.log(
              `Sorting all products: ${a.name}(${priceB}) vs ${b.name}(${priceA})`
            );
            return priceB - priceA;
          });
          break;
      }

      renderProductGrid(sortedProducts);
    } else {
      renderProductGrid(products);
    }
  };

  // Display search results
  const displaySearchResults = (query) => {
    const results = BrewAndClayDB.searchProducts(query);
    // Update page title
    const titleElement = document.querySelector("h1");
    if (titleElement) {
      titleElement.textContent = `Search Results for "${query}"`;
    }
    renderProductGrid(results);
  };

  // Display category products
  const displayCategoryProducts = (category) => {
    const products = BrewAndClayDB.getProductsByCategory(category);
    // Update page title
    const titleElement = document.querySelector("h1");
    if (titleElement) {
      titleElement.textContent = category;
    }
    renderProductGrid(products);
  };

  // Display collections
  const displayCollections = () => {
    const collections = BrewAndClayDB.getAllCollections();
    const productsContainer = document.querySelector(
      ".grid.grid-cols-1.md\\:grid-cols-3.gap-8"
    );

    if (productsContainer) {
      // Clear existing content
      productsContainer.innerHTML = "";

      // Create a document fragment to improve performance
      const fragment = document.createDocumentFragment();

      // Render collections
      collections.forEach((collection) => {
        const collectionCard = document.createElement("div");
        collectionCard.className =
          "group relative rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow";
        collectionCard.innerHTML = `
                    <div class="aspect-w-1 aspect-h-1">
                        <img src="" alt="${collection.name}" class="w-full h-full object-cover">
                    </div>
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900">${collection.name}</h3>
                        <p class="mt-2 text-sm text-gray-500">${collection.description}</p>
                        <button class="!rounded-button mt-4 w-full bg-custom text-white py-2 px-4 hover:bg-custom/90">View Collection</button>
                    </div>
                `;

        // Add event listener to the button
        const button = collectionCard.querySelector("button");
        button.addEventListener("click", () => {
          window.location.href = `${pages.shop}?category=${encodeURIComponent(
            collection.name
          )}`;
        });

        fragment.appendChild(collectionCard);
      });

      // Append all collections at once
      productsContainer.appendChild(fragment);
    }
  };

  // Render product grid
  const renderProductGrid = (products) => {
    const productsContainer = document.querySelector(
      ".grid.grid-cols-1.md\\:grid-cols-3.gap-8"
    );

    // Show message if no products match the filters
    if (products.length === 0) {
      productsContainer.innerHTML = `
        <div class="col-span-3 py-8 text-center">
          <p class="text-gray-500">No products match your selected filters.</p>
          <button class="rounded-button mt-4 border border-custom text-custom py-2 px-4 hover:bg-custom hover:text-white transition-colors clear-filters-btn">
            Clear Filters
          </button>
        </div>
      `;

      // Add event listener to clear filters button
      const clearFiltersBtn =
        productsContainer.querySelector(".clear-filters-btn");
      if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener("click", () => {
          // Uncheck all filter checkboxes
          document
            .querySelectorAll('input[type="checkbox"]')
            .forEach((checkbox) => {
              checkbox.checked = false;
            });

          // Display all products
          displayAllProducts();
        });
      }

      return;
    }

    if (productsContainer) {
      // Clear existing content
      productsContainer.innerHTML = "";

      // Create a document fragment to improve performance
      const fragment = document.createDocumentFragment();

      // Render products
      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className =
          "group relative rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow product-card";
        productCard.dataset.productId = product.id;
        productCard.innerHTML = `
                    <div class="aspect-w-1 aspect-h-1">
                        <img src="${product.image}" alt="${
          product.name
        }" class="w-full h-full object-cover product-image">
                    </div>
                    <div class="p-6">
                        <h3 class="text-lg font-medium text-gray-900 product-name">${
                          product.name
                        }</h3>
                        <p class="mt-2 text-sm text-gray-500 product-price">$${product.price.toFixed(
                          2
                        )}</p>
                        <button class="!rounded-button mt-4 w-full bg-custom text-white py-2 px-4 hover:bg-custom/90 add-to-cart-btn">Add to Cart</button>
                    </div>
                `;

        // Add event listener to the button
        const button = productCard.querySelector("button");
        button.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent event bubbling
          BrewAndClay.addToCart(product);
        });

        // Make the entire card clickable for better UX
        productCard.style.cursor = "pointer";
        productCard.addEventListener("click", function (e) {
          // Don't navigate if clicking on the Add to Cart button
          if (!e.target.closest(".add-to-cart-btn")) {
            window.location.href = `${pages.product}?id=${encodeURIComponent(
              product.id
            )}`;
          }
        });

        fragment.appendChild(productCard);
      });

      // Append all products at once
      productsContainer.appendChild(fragment);
    }
  };

  // Product page initialization
  const initProductPage = () => {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (productId) {
      const product = BrewAndClayDB.getProductById(productId);
      if (product) {
        // Update product details
        updateProductDetails(product);
      } else {
        // Product not found, redirect to shop
        window.location.href = pages.shop;
      }
    } else {
      // No product ID, redirect to shop
      window.location.href = pages.shop;
    }
  };

  // Update product details on product page
  const updateProductDetails = (product) => {
    // Update product image
    const productImage = document.querySelector(".product-image");
    if (productImage) {
      productImage.src = product.image;
      productImage.alt = product.name;
    }

    // Update product name
    const productName = document.querySelector(".product-name");
    if (productName) {
      productName.textContent = product.name;
    }

    // Update product price
    const productPrice = document.querySelector(".product-price");
    if (productPrice) {
      productPrice.textContent = `$${product.price.toFixed(2)}`;
    }

    // Update product description
    const productDescription = document.querySelector(".product-description");
    if (productDescription) {
      productDescription.textContent = product.description;
    }

    // Update add to cart button
    const addToCartButton = document.querySelector(".add-to-cart-btn");
    if (addToCartButton) {
      addToCartButton.addEventListener("click", () => {
        BrewAndClay.addToCart(product);
      });
    }
  };

  // Cart page initialization
  const initCartPage = () => {
    // Add cart-items class to the cart container
    const cartContainer = document.querySelector(".p-6.space-y-6");
    if (cartContainer) {
      cartContainer.classList.add("cart-items");
    }

    renderCart();

    // Checkout button
    const checkoutButton = document.querySelector(
      "button.w-full.mt-6.bg-custom"
    );
    if (checkoutButton) {
      checkoutButton.addEventListener("click", () => {
        window.location.href = pages.checkout;
      });
    }
  };

  // Render cart items
  const renderCart = () => {
    const cartItems = BrewAndClay.getCart();
    const cartContainer = document.querySelector(".cart-items");
    const orderSummaryContainer = document.querySelector(
      ".space-y-2.pb-4.border-b"
    );
    const subtotalElement = document.querySelector(
      ".flex.justify-between:nth-child(1) .font-medium.text-gray-900"
    );
    const totalElement = document.querySelector(
      ".text-lg.font-medium.text-custom"
    );

    if (cartContainer) {
      // Clear existing content
      cartContainer.innerHTML = "";

      if (cartItems.length === 0) {
        // Show empty cart message
        cartContainer.innerHTML = `
          <div class="text-center py-8">
            <p class="text-gray-500">Your cart is empty</p>
            <a href="${pages.shop}" class="inline-block mt-4 bg-custom text-white py-2 px-4 rounded-button hover:bg-custom/90">Continue Shopping</a>
          </div>
        `;

        // Update totals
        if (subtotalElement) subtotalElement.textContent = "$0.00";
        if (totalElement) totalElement.textContent = "$0.00";
      } else {
        // Create a document fragment to improve performance
        const fragment = document.createDocumentFragment();

        // Render cart items
        cartItems.forEach((item) => {
          const cartItemElement = document.createElement("div");
          cartItemElement.className =
            "flex items-center justify-between pb-6 border-b";
          cartItemElement.dataset.productId = item.id; // Add product ID as data attribute
          cartItemElement.innerHTML = `
            <div class="flex items-center space-x-4">
              <img src="${item.image}" alt="${
            item.name
          }" class="w-20 h-20 object-cover rounded-md" />
              <div>
                <h3 class="font-medium text-gray-900">${item.name}</h3>
                <p class="text-sm text-gray-500">Qty: ${item.quantity}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <span class="font-medium text-custom">$${(
                item.price * item.quantity
              ).toFixed(2)}</span>
              <button class="text-gray-400 hover:text-red-500 remove-item-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;

          // Add event listener for remove button
          const removeBtn = cartItemElement.querySelector(".remove-item-btn");
          removeBtn.addEventListener("click", () => {
            BrewAndClay.removeFromCart(item.id);
            renderCart(); // Re-render cart after update
          });

          fragment.appendChild(cartItemElement);
        });

        // Append all items at once
        cartContainer.appendChild(fragment);

        // Calculate subtotal
        const subtotal = cartItems.reduce((total, item) => {
          return total + parseFloat(item.price) * parseInt(item.quantity);
        }, 0);

        // Update subtotal
        if (subtotalElement) {
          subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        } else {
          // Try a more specific selector if the first one didn't work
          const altSubtotalElement = document.querySelector(
            ".space-y-2.pb-4.border-b .flex.justify-between:first-child .font-medium"
          );
          if (altSubtotalElement) {
            altSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
          }
        }

        // Calculate total (subtotal + shipping)
        const shippingElement = document.querySelector(
          ".flex.justify-between:nth-child(2) .font-medium.text-gray-900"
        );
        let shipping = 65.0; // Fixed shipping cost of $65.00
        if (shippingElement) {
          shippingElement.textContent = `$${shipping.toFixed(2)}`;
        }
        const total = subtotal + shipping;

        // Update total
        if (totalElement) {
          totalElement.textContent = `$${total.toFixed(2)}`;
        }

        // Update order summary to match checkout page format
        if (orderSummaryContainer) {
          // Clear existing content but keep the structure for subtotal and shipping
          orderSummaryContainer.innerHTML = "";

          // Create a document fragment for the order items
          const orderFragment = document.createDocumentFragment();

          // Add each cart item to the order summary
          cartItems.forEach((item) => {
            const orderItemElement = document.createElement("div");
            orderItemElement.className = "flex justify-between py-2";
            orderItemElement.innerHTML = `
              <div>
                <span class="font-medium">${item.name}</span>
                <span class="text-gray-500 ml-2">x${item.quantity}</span>
              </div>
              <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            orderFragment.appendChild(orderItemElement);
          });

          // Append the order items
          orderSummaryContainer.appendChild(orderFragment);

          // Add back the subtotal and shipping rows
          const subtotalRow = document.createElement("div");
          subtotalRow.className = "flex justify-between";
          subtotalRow.innerHTML = `<span class="text-gray-600">Subtotal</span><span class="font-medium text-gray-900">$${subtotal.toFixed(
            2
          )}</span>`;

          const shippingRow = document.createElement("div");
          shippingRow.className = "flex justify-between";
          shippingRow.innerHTML = `<span class="text-gray-600">Shipping (6-7 days)</span><span class="font-medium text-gray-900">$${shipping.toFixed(
            2
          )}</span>`;

          orderSummaryContainer.appendChild(subtotalRow);
          orderSummaryContainer.appendChild(shippingRow);
        }
      }
    }
  };

  // Checkout page initialization
  const initCheckoutPage = () => {
    const cartItems = BrewAndClay.getCart();
    const orderSummaryContainer = document.querySelector(
      ".space-y-2.pb-4.border-b"
    );
    const subtotalElement = document.querySelector(
      ".flex.justify-between span.font-medium.text-gray-900"
    );
    const totalElement = document.querySelector(
      ".text-lg.font-medium.text-custom"
    );

    // Redirect to cart if cart is empty
    if (cartItems.length === 0) {
      window.location.href = pages.cart;
      return;
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => {
      return total + parseFloat(item.price) * parseInt(item.quantity);
    }, 0);

    // Fixed shipping cost
    const shipping = 65.0;

    // Calculate total (subtotal + shipping)
    const total = subtotal + shipping;

    // Render order summary
    if (orderSummaryContainer) {
      // Clear existing content
      orderSummaryContainer.innerHTML = "";

      // Create a document fragment for the order items
      const fragment = document.createDocumentFragment();

      // Add each cart item to the order summary
      cartItems.forEach((item) => {
        const orderItemElement = document.createElement("div");
        orderItemElement.className = "flex justify-between py-2";
        orderItemElement.innerHTML = `
          <div>
            <span class="font-medium">${item.name}</span>
            <span class="text-gray-500 ml-2">x${item.quantity}</span>
          </div>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        fragment.appendChild(orderItemElement);
      });

      // Append the order items
      orderSummaryContainer.appendChild(fragment);

      // Add the subtotal and shipping rows
      const subtotalRow = document.createElement("div");
      subtotalRow.className = "flex justify-between";
      subtotalRow.innerHTML = `<span class="text-gray-600">Subtotal</span><span class="font-medium text-gray-900">$${subtotal.toFixed(
        2
      )}</span>`;

      const shippingRow = document.createElement("div");
      shippingRow.className = "flex justify-between";
      shippingRow.innerHTML = `<span class="text-gray-600">Shipping (6-7 days)</span><span class="font-medium text-gray-900">$${shipping.toFixed(
        2
      )}</span>`;

      orderSummaryContainer.appendChild(subtotalRow);
      orderSummaryContainer.appendChild(shippingRow);
    }

    // Update total
    if (totalElement) {
      totalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Handle checkout form submission
    const checkoutForm = document.querySelector("form");
    const confirmOrderButton = document.querySelector(
      "button.w-full.mt-6.bg-custom"
    );

    if (checkoutForm && confirmOrderButton) {
      confirmOrderButton.addEventListener("click", function (e) {
        e.preventDefault();

        if (checkoutForm.checkValidity()) {
          // Collect form data
          const formData = {
            fullName: checkoutForm.querySelector('input[type="text"]').value,
            email: checkoutForm.querySelector('input[type="email"]').value,
            phone: checkoutForm.querySelector('input[type="tel"]').value,
            city: checkoutForm.querySelectorAll('input[type="text"]')[1].value,
            address: checkoutForm.querySelector("textarea").value,
          };

          // Send order confirmation email
          BrewAndClayEmail.sendOrderConfirmation(formData, cartItems)
            .then((response) => {
              console.log("Order confirmation email sent successfully");
              // Show success message
              alert(
                "Order placed successfully! An email confirmation has been sent to your email address."
              );
              // Clear cart and redirect to home page
              sessionStorage.removeItem("brewAndClayCart");
              window.location.href = pages.home;
            })
            .catch((error) => {
              console.error("Failed to send order confirmation email:", error);
              // Still complete the order even if email fails
              alert(
                "Order placed successfully! Thank you for your purchase. (Email confirmation could not be sent)"
              );
              sessionStorage.removeItem("brewAndClayCart");
              window.location.href = pages.home;
            });
        } else {
          // If form is not valid, show validation messages
          checkoutForm.reportValidity();
        }
      });
    }
  };

  // Public API
  return {
    init: initPageSpecific,
  };
})();

// Initialize the UI when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  BrewAndClayUI.init();
});
