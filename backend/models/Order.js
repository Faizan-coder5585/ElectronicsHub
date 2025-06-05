const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String, 
        price: Number, 
        quantity: Number
      }
    ],
    totalAmount: Number,
    status: { type: String, default: 'Pending' },
    paymentStatus: { type: String, default: 'Unpaid' }, // "Unpaid" -> "Paid"
    createdAt: { type: Date, default: Date.now },
  });


const OrderModel =  mongoose.model('Order', orderSchema);
module.exports = OrderModel;
