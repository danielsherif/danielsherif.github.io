import emailjs from "@emailjs/browser";

interface OrderDetails {
  customerInfo: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  items: Array<{
    name: string;
    price: number;
  }>;
  total: string;
}

// Initialize EmailJS with your user ID
emailjs.init({
  publicKey: "PaEHeRVrmRSR6f4rW",
  blockHeadless: true, // Enable this in production for security
});

export const sendOrderConfirmation = async (orderDetails: OrderDetails) => {
  try {
    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; background-color: #ffffff;">
        <div style="text-align: center; padding: 20px 0; background-color: #4299e1; margin: -20px -20px 20px -20px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Order Confirmation</h1>
        </div>

        <p style="color: #333; font-size: 16px;">Dear ${
          orderDetails.customerInfo.name
        },</p>
        <p style="color: #333; font-size: 16px;">Thank you for your order! We're excited to confirm your purchase from Brew and Clay.</p>
        
        <div style="background-color: #f8f8f8; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h2 style="color: #2c5282; margin-bottom: 15px; font-size: 20px;">Order Details</h2>
          <div style="margin-bottom: 10px;">
            <strong style="color: #2d3748;">Order Total:</strong>
            <span style="color: #2c5282; font-weight: bold;">$${
              orderDetails.total
            }</span>
          </div>
          <div style="margin-bottom: 10px;">
            <strong style="color: #2d3748;">Delivery Address:</strong>
            <span style="color: #4a5568;">${
              orderDetails.customerInfo.address
            }</span>
          </div>
          <div style="margin-bottom: 10px;">
            <strong style="color: #2d3748;">Contact Number:</strong>
            <span style="color: #4a5568;">${
              orderDetails.customerInfo.phone
            }</span>
          </div>
        </div>

        <div style="margin: 20px 0;">
          <h2 style="color: #2c5282; font-size: 20px;">Items Ordered</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background-color: #4299e1;">
              <th style="padding: 12px; text-align: left; border: 1px solid #e2e8f0; color: #ffffff;">Item</th>
              <th style="padding: 12px; text-align: right; border: 1px solid #e2e8f0; color: #ffffff;">Price</th>
            </tr>
            ${orderDetails.items
              .map(
                (item) => `
              <tr>
                <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${item.name}</td>
                <td style="padding: 12px; text-align: right; border: 1px solid #e2e8f0; color: #2c5282; font-weight: bold;">$${item.price}</td>
              </tr>
            `
              )
              .join("")}
            <tr style="background-color: #f7fafc;">
              <td style="padding: 12px; border: 1px solid #e2e8f0; color: #2d3748;"><strong>Total</strong></td>
              <td style="padding: 12px; text-align: right; border: 1px solid #e2e8f0; color: #2c5282;"><strong>$${
                orderDetails.total
              }</strong></td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #4a5568; margin-bottom: 10px; font-size: 14px;">If you have any questions about your order, please don't hesitate to contact us.</p>
          <p style="color: #4a5568; font-size: 14px;">Best regards,<br>The Brew and Clay Team</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; font-size: 12px;">&copy; 2024 Brew and Clay. All rights reserved.</p>
        </div>
      </div>
    `;

    const response = await emailjs.send("service_z6jxwxf", "template_8co91g7", {
      to_name: orderDetails.customerInfo.name,
      to_email: orderDetails.customerInfo.email,
      message: `Order Details:\n\nDelivery Address: ${
        orderDetails.customerInfo.address
      }\nContact Number: ${
        orderDetails.customerInfo.phone
      }\n\nItems Ordered:\n${orderDetails.items
        .map((item) => `${item.name}: $${item.price}`)
        .join("\n")}\n\nTotal: $${orderDetails.total}`,
      template_content: emailTemplate,
    });

    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
