const express = require('express');
const { registerUser, loginUser, getMe, getAllUsers } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Standard public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route for any logged-in user
router.get('/me', protect, getMe);

// 🛡️ Admin-only route to get all registered users
router.get('/users', protect, authorize('admin'), getAllUsers); 

module.exports = router;