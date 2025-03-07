// Initialize EmailJS with your public key
emailjs.init("PaEHeRVrmRSR6f4rW");

// Sample product data
const products = [
  { id: 1, name: "Handcrafted Mug 1", price: 25.99, image: "mugs/1.png" },
  { id: 2, name: "Handcrafted Mug 2", price: 29.99, image: "mugs/2.png" },
  { id: 3, name: "Handcrafted Mug 3", price: 27.99, image: "mugs/3.JPG" },
  { id: 4, name: "Handcrafted Mug 4", price: 24.99, image: "mugs/4.JPG" },
];

// Shopping cart state
let cart = [];

// Display products
function displayProducts() {
  const container = document.getElementById("products-container");
  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.className = "product-card";
    productElement.innerHTML = `
            <img src="${product.image}" alt="${
      product.name
    }" onerror="this.src='mugs/placeholder.jpg'">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
    container.appendChild(productElement);
  });
}

// Add item to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (product) {
    cart.push({ ...product, quantity: 1 });
    updateCartCount();
  }
}

// Update cart count
function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

// Toggle cart modal
function toggleCart() {
  const modal = document.getElementById("cart-modal");
  modal.style.display = modal.style.display === "none" ? "block" : "none";
  if (modal.style.display === "block") {
    displayCartItems();
  }
}

// Display cart items
function displayCartItems() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  let total = 0;

  cartItems.innerHTML = "";
  cart.forEach((item) => {
    total += item.price * item.quantity;
    cartItems.innerHTML += `
            <div>
                <p>${item.name} - $${item.price.toFixed(2)} x ${
      item.quantity
    }</p>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
  });

  cartTotal.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
}

// Remove item from cart
function removeFromCart(productId) {
  const index = cart.findIndex((item) => item.id === productId);
  if (index > -1) {
    cart.splice(index, 1);
    updateCartCount();
    displayCartItems();
  }
}

// Handle checkout form submission
document
  .getElementById("checkout-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const templateParams = {
      to_name: "Admin",
      from_name: document.getElementById("name").value,
      message: `New Order Details:

Customer Information:
Name: ${document.getElementById("name").value}\nEmail: ${
        document.getElementById("email").value
      }\nPhone: ${document.getElementById("phone").value}\nAddress: ${
        document.getElementById("address").value
      }\n\nOrder Items:\n${cart
        .map(
          (item) =>
            `${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${(
              item.price * item.quantity
            ).toFixed(2)}`
        )
        .join("\n")}\n\nTotal Amount: $${cart
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2)}`,
    };

    emailjs.send("service_z6jxwxf", "template_8co91g7", templateParams).then(
      function () {
        alert("Order placed successfully!");
        cart = [];
        updateCartCount();
        toggleCart();
      },
      function (error) {
        console.error("Error:", error);
        alert("Failed to place order. Please try again.");
      }
    );
  });

// Initialize the page
displayProducts();
