const express = require('express');
const router = express.Router();
const { addToCart, getCart, removeFromCart,  updateCartItem, } = require('../controller/CartProductController.js');


// Add product to cart
router.post('/add', addToCart);
router.get('/:userId', getCart);
router.delete('/:Id', removeFromCart);
router.put('/', updateCartItem);



module.exports = router