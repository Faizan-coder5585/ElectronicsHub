// CartModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // Correct reference to the Product model
            quantity: { type: Number, required: true }
        }
    ]
});

const CartModel = mongoose.model('Cart', CartSchema);

module.exports = CartModel;
