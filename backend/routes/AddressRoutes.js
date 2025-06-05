const express = require('express');
const { saveAddress, getAllAddresses, getAddressById, updateAddress, deleteAddress } = require('../controller/AddressController.js');
const authMiddleware = require('../middleware/AuthMiddleware.js');
const router = express.Router();

// 📌 Create a new address
router.post('/submit-address', authMiddleware, saveAddress);

// 📌 Get all addresses
router.get('/', authMiddleware, getAllAddresses);

// 📌 Get a single address by ID
router.get('/:id', authMiddleware, getAddressById);

// 📌 Update an address by ID
router.put('/:id', authMiddleware, updateAddress);

// 📌 Delete an address by ID
router.delete('/:id', authMiddleware, deleteAddress);

module.exports = router;

