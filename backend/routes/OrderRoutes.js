const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/AuthMiddleware');
const { placeOrder, getOrderDetails, getUserOrders, updatePaymentStatus } = require('../controller/OrderController');

router.post('/place-order', authMiddleware, placeOrder);
router.get('/:orderId', authMiddleware, getOrderDetails);
router.get('/user-orders', authMiddleware, getUserOrders); // NEW
router.patch('/payment-status', authMiddleware, updatePaymentStatus);

module.exports = router;
