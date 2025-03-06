import { useState } from "react";
import "./App.css";
import { sendOrderConfirmation } from "./emailService";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
  phone: string;
}

function App() {
  const [cart, setCart] = useState<Product[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Handcrafted Ceramic Mug",
      price: 24.99,
      image: "/images/1.png",
      description: "Beautiful handmade ceramic mug with unique design",
    },
    {
      id: 2,
      name: "Artisan Coffee Set",
      price: 49.99,
      image: "/images/2.png",
      description: "Complete coffee set with handcrafted pottery pieces",
    },
    {
      id: 3,
      name: "Decorative Clay Vase",
      price: 34.99,
      image: "/images/3.JPG",
      description: "Elegant clay vase perfect for home decoration",
    },
    {
      id: 4,
      name: "Pottery Bowl Set",
      price: 39.99,
      image: "/images/4.JPG",
      description: "Set of handmade pottery bowls for your kitchen",
    },
    {
      id: 5,
      name: "Ceramic Tea Set",
      price: 54.99,
      image: "/images/5.JPG",
      description: "Traditional ceramic tea set with intricate details",
    },
    {
      id: 6,
      name: "Clay Flower Pot",
      price: 29.99,
      image: "/images/6.JPG",
      description: "Handcrafted clay flower pot for your plants",
    },
  ]);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId: number) => {
    const index = cart.findIndex((item) => item.id === productId);
    if (index > -1) {
      const newCart = [...cart];
      newCart.splice(index, 1);
      setCart(newCart);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderDetails = {
      customerInfo: formData,
      items: cart,
      total: calculateTotal(),
    };

    try {
      await sendOrderConfirmation(orderDetails);
      console.log("Order submitted successfully:", orderDetails);
      setCart([]);
      setShowCheckout(false);
      alert("Order placed successfully! Check your email for confirmation.");
    } catch (error) {
      console.error("Failed to submit order:", error);
      alert("Failed to place order. Please try again later.");
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Fashion Store</h1>
        <div className="cart-info">
          Cart Items: {cart.length} | Total: ${calculateTotal()}
        </div>
      </header>

      <main>
        {!showCheckout ? (
          <>
            <section className="products">
              <h2>Our Products</h2>
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product.id} className="product-card">
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p className="price">${product.price}</p>
                    <button onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="cart">
              <h2>Shopping Cart</h2>
              {cart.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                <div className="cart-items">
                  {cart.map((item, index) => (
                    <div key={index} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p>${item.price}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="cart-total">
                    <h3>Total: ${calculateTotal()}</h3>
                    <button
                      className="checkout-button"
                      onClick={() => setShowCheckout(true)}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="checkout-form">
            <h2>Checkout</h2>
            <form onSubmit={handleCheckout}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Delivery Address:</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="order-summary">
                <h3>Order Summary</h3>
                {cart.map((item, index) => (
                  <div key={index} className="summary-item">
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                  </div>
                ))}
                <div className="summary-total">
                  <strong>Total:</strong>
                  <strong>${calculateTotal()}</strong>
                </div>
              </div>
              <div className="form-buttons">
                <button type="button" onClick={() => setShowCheckout(false)}>
                  Back to Cart
                </button>
                <button type="submit" className="submit-order">
                  Place Order
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
