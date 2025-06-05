const express = require('express');
const router = express.Router();
const {
  userRegister,
  verifyOtp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken,
  getUser,
  getAllUsers,
  updateUser,
  dashboard,
} = require('../controller/UserController.js');
const authMiddleware = require('../middleware/AuthMiddleware.js');

router.post('/register', userRegister);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

// Admin-protected routes
router.get('/:id',  getUser);
router.get('/', authMiddleware, getAllUsers);
router.put('/:id', authMiddleware, updateUser);
router.get('/dashboard/:id', dashboard);




module.exports = router
