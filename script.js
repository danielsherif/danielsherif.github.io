// Cart state management
let cart = {
    items: [],
    total: 0
};

// DOM Elements
const cartToggle = document.getElementById('cart-toggle');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const totalAmount = document.getElementById('total-amount');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutForm = document.getElementById('checkout-form');
const cartData = document.getElementById('cart-data');

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const cartData = JSON.parse(savedCart);
        const timestamp = localStorage.getItem('cartTimestamp');
        
        // Check if cart is older than 24 hours
        if (timestamp && Date.now() - parseInt(timestamp) > 24 * 60 * 60 * 1000) {
            clearCart();
        } else {
            cart = cartData;
            updateCartUI();
        }
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartTimestamp', Date.now().toString());
}

// Clear cart
function clearCart() {
    cart = { items: [], total: 0 };
    localStorage.removeItem('cart');
    localStorage.removeItem('cartTimestamp');
    updateCartUI();
}

// Update cart UI
function updateCartUI() {
    cartCount.textContent = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    totalAmount.textContent = cart.total.toFixed(2);
    
    // Update cart items display
    cartItems.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
    `).join('');
    
    // Enable/disable checkout button
    checkoutBtn.disabled = cart.items.length === 0;
}

// Add item to cart
function addToCart(product) {
    const existingItem = cart.items.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    saveCart();
    updateCartUI();
}

// Remove item from cart
function removeFromCart(productId) {
    cart.items = cart.items.filter(item => item.id !== productId);
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    saveCart();
    updateCartUI();
}

// Toggle cart sidebar
cartToggle.addEventListener('click', () => {
    cartSidebar.classList.toggle('visible');
});

// Handle checkout button
checkoutBtn.addEventListener('click', () => {
    cartData.value = JSON.stringify(cart);
    checkoutModal.classList.remove('hidden');
});

// Close modal when clicking outside
checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) {
        checkoutModal.classList.add('hidden');
    }
});

// Handle form submission
checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch(checkoutForm.action, {
            method: 'POST',
            body: new FormData(checkoutForm),
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            clearCart();
            alert('Order placed successfully!');
            checkoutModal.classList.add('hidden');
            checkoutForm.reset();
        } else {
            console.error('Form submission failed');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});

// Sample products data (to be replaced with products.json)
const sampleProducts = [
    {
        id: '1',
        name: 'Handcrafted Mug',
        description: 'Beautiful ceramic mug, perfect for your morning coffee',
        price: 24.99,
        image: 'images/mug.webp'
    },
    {
        id: '2',
        name: 'Clay Vase',
        description: 'Elegant vase for your home decor',
        price: 39.99,
        image: 'images/vase.webp'
    },
    {
        id: '3',
        name: 'Tea Set',
        description: 'Complete tea set with 4 cups and teapot',
        price: 89.99,
        image: 'images/tea-set.webp'
    },
    {
        id: '4',
        name: 'Plant Pot',
        description: 'Minimalist plant pot for your indoor plants',
        price: 19.99,
        image: 'images/plant-pot.webp'
    },
    {
        id: '5',
        name: 'Serving Bowl',
        description: 'Large serving bowl for family gatherings',
        price: 44.99,
        image: 'images/bowl.webp'
    },
    {
        id: '6',
        name: 'Decorative Plate',
        description: 'Hand-painted decorative plate',
        price: 29.99,
        image: 'images/plate.webp'
    }
];

// Render products
function renderProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${JSON.stringify(product)})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    renderProducts(sampleProducts);
});