// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require('../controller/PaymentController.js');

router.post('/create-order', createRazorpayOrder);
router.post('/verify-payment', verifyRazorpayPayment);

module.exports = router;
