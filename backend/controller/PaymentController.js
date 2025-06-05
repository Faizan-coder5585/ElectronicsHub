const Razorpay = require('razorpay');
const crypto = require('crypto');
const PaymentModel = require('../models/Payment.js');
const OrderModel = require('../models/Order.js');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: "Order ID is required" });

    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.totalAmount) {
      return res.status(400).json({ message: "Order total amount missing. Cannot proceed with payment." });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.totalAmount * 100, // amount in paise
      currency: "INR",
      receipt: orderId,
    });

    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      order_id: razorpayOrder.id, // changed to snake_case
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

// Verify Razorpay payment and save record
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      amount, // amount in paise
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId || !amount) {
      return res.status(400).json({ message: "Missing required payment verification fields" });
    }

    // Verify signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Check if payment was already processed
    const existingPayment = await PaymentModel.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (existingPayment) {
      return res.status(409).json({
        success: true,
        message: "Payment already processed",
        paymentInfo: {
          razorpayPaymentId: existingPayment.razorpayPaymentId,
          amount: existingPayment.amount,
          status: existingPayment.status,
        },
        orderStatus: "Paid",
      });
    }

    // Find order by ID
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check amount matches order totalAmount (converted to paise)
    const expectedAmountInPaise = order.totalAmount * 100;
    if (Number(amount) !== expectedAmountInPaise) {
      return res.status(400).json({ message: "Amount mismatch with order" });
    }

    // Save payment details
    const payment = new PaymentModel({
      orderId,
      amount: order.totalAmount,
      paymentMethod: "razorpay",
      status: "Completed",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    await payment.save();

    // Update order payment and status
    // Update order payment and status
    order.paymentStatus = "Paid";
    order.status = "Completed";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      paymentInfo: {
        razorpayPaymentId: razorpay_payment_id,
        amount: order.totalAmount,
        status: "Completed",
      },
      orderStatus: "Paid",
    });

  } catch (error) {
    console.error("❌ Error verifying payment:", error, "Request body:", req.body);
    return res.status(500).json({ message: "Payment verification failed", error: error.message });
  }
};
