const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getAllProductsReviews, addReview, getProductReviews, updateReview, deleteReview } = require('../controller/ProductController.js');
// const upload = require('../config/multer-config.js');

// Product Routes
// Create product with image upload
// router.post('/product', upload.single('img'), createProduct);
router.post('/product',  createProduct);
router.get('/products', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/reviews', addReview);
router.get('/reviews/all', getAllProductsReviews);
router.get('/:id/reviews', getProductReviews);
router.put('/:productId/reviews/:reviewId', updateReview);
router.delete('/:productId/reviews/:reviewId', deleteReview);



module.exports = router
