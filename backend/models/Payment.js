const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  }, // Reference to your internal MongoDB order

  razorpayOrderId: {
    type: String,
    required: true,
    unique: true, // Razorpay's order IDs are unique
  },

  razorpayPaymentId: {
    type: String,
    required: true,
    unique: true, // Razorpay's payment IDs are unique
  },

  razorpaySignature: {
    type: String,
    required: true,
  },

  amount: {
    type: Number,
    required: true, // Store amount in rupees
  },

  paymentMethod: {
    type: String,
    required: true, // e.g., 'razorpay'
  },

  status: {
    type: String,
    enum: ['Completed', 'Failed', 'Pending'],
    default: 'Completed',
  },

  completedAt: {
    type: Date,
    default: Date.now,
  },
});

const PaymentModel = mongoose.model('Payment', paymentSchema);
module.exports = PaymentModel;
