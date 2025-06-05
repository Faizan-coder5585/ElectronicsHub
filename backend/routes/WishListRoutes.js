const express = require('express');
const { getWishlist, addToWishlist, removeFromWishlist, clearWishlist } = require('../controller/WishListProductController.js');
const authMiddleware = require('../middleware/AuthMiddleware.js');
const router = express.Router();


router.get('/', authMiddleware, getWishlist)
router.post('/', authMiddleware, addToWishlist)
router.delete('/:id', authMiddleware,  removeFromWishlist)
router.delete('/',  authMiddleware, clearWishlist)

module.exports = router;
