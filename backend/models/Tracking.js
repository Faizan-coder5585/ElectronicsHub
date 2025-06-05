const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  trackingNumber: { type: String, required: true },
  status: { type: String, default: 'In Transit' },  // Tracking status: In Transit, Delivered
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tracking', trackingSchema);
