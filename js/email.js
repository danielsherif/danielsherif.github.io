// Brew & Clay - Email Module

// EmailJS integration for sending order confirmations
const BrewAndClayEmail = (function () {
  // EmailJS configuration
  const serviceID = "service_z6jxwxf";
  const templateID = "template_8co91g7";
  const publicKey = "PaEHeRVrmRSR6f4rW";

  // Initialize EmailJS
  const init = () => {
    emailjs.init(publicKey);
    console.log("EmailJS initialized");
  };

  // Format cart items for email
  const formatCartItemsForEmail = (cartItems, customerDetails) => {
    let messageText = "Customer Details:\n\n";

    // Add customer information
    messageText += `Name: ${customerDetails.fullName}\n`;
    messageText += `Email: ${customerDetails.email}\n`;
    messageText += `Phone: ${customerDetails.phone}\n`;
    messageText += `City: ${customerDetails.city}\n`;
    messageText += `Address: ${customerDetails.address}\n\n`;

    messageText += "Order Details:\n\n";

    // Add each item with quantity and price
    cartItems.forEach((item) => {
      messageText += `${item.name} x${item.quantity} - $${(
        item.price * item.quantity
      ).toFixed(2)}\n`;
    });

    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Add shipping cost
    const shipping = 65.0; // Fixed shipping cost

    // Add subtotal, shipping, and total to the message
    messageText += "\n";
    messageText += `Subtotal: $${subtotal.toFixed(2)}\n`;
    messageText += `Shipping: $${shipping.toFixed(2)}\n`;
    messageText += `Total (including delivery): $${(
      subtotal + shipping
    ).toFixed(2)}\n`;

    return messageText;
  };

  // Send order confirmation email
  const sendOrderConfirmation = (formData, cartItems) => {
    // Log the customer email for verification
    console.log("Customer email being used:", formData.email);

    // Format cart items for email
    const messageText = formatCartItemsForEmail(cartItems, formData);

    // Prepare email parameters
    const emailParams = {
      to_name: formData.fullName,
      from_name: "Brew and Clay",
      to_email: formData.email, // Customer's email as the primary recipient
      message: messageText,
      reply_to: "danielsherif4761@gmail.com",
      cc: formData.email, // Explicitly set CC to customer's email to override template settings
      // Your email is only used as reply_to, not as the recipient
    };

    // Log the email parameters for debugging
    console.log("Sending email with parameters:", emailParams);

    // Send email using EmailJS
    return emailjs
      .send(serviceID, templateID, emailParams)
      .then((response) => {
        console.log("Email sent successfully:", response);
        return response;
      })
      .catch((error) => {
        console.error("Email sending failed:", error);
        throw error;
      });
  };

  // Public API
  return {
    init: init,
    sendOrderConfirmation: sendOrderConfirmation,
  };
})();

// Initialize EmailJS when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  BrewAndClayEmail.init();
});
