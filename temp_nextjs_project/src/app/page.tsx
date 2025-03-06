"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product, CheckoutFormData } from "@/types";
import { sendOrderConfirmation, initEmailJS } from "@/utils/emailService";

export default function Home() {
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

  useEffect(() => {
    // Initialize EmailJS when component mounts
    initEmailJS();
  }, []);

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Brew and Clay
        </h1>
        <div className="text-lg font-medium text-gray-600">
          Cart Items: {cart.length} | Total: ${calculateTotal()}
        </div>
      </header>

      <main>
        {!showCheckout ? (
          <>
            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Our Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 hover:shadow-xl"
                  >
                    <div className="relative h-64 w-full">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-opacity hover:opacity-90"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-xl font-bold text-blue-700">
                          ${product.price}
                        </p>
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-gray-50 rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Shopping Cart
              </h2>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Your cart is empty
                </p>
              ) : (
                <div className="space-y-6">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-md shadow-sm"
                    >
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 mb-4 sm:mb-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-md"
                        />
                      </div>
                      <div className="flex-grow px-4">
                        <h3 className="text-lg font-medium text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-blue-700 font-semibold">
                          ${item.price}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-800">
                        Total: ${calculateTotal()}
                      </h3>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
                        onClick={() => setShowCheckout(true)}
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </>
        ) : (
          <section className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Checkout
            </h2>
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Delivery Address:
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number:
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-md mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-2 mb-4">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-2 border-b border-gray-200"
                    >
                      <span className="text-gray-700">{item.name}</span>
                      <span className="font-medium text-gray-900">
                        ${item.price}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-2 font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
              </div>

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
                >
                  Back to Cart
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors"
                >
                  Place Order
                </button>
              </div>
            </form>
          </section>
        )}
      </main>

      <footer className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-500">
        <p>&copy; 2024 Brew and Clay. All rights reserved.</p>
      </footer>
    </div>
  );
}
