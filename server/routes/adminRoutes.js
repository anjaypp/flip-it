const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();

// User routes
router.get('/users', adminController.getAllUsers); // Get all users
router.put('/users/block/:id', adminController.blockUser); // Block a user by ID
router.put('/users/unblock/:id', adminController.unblockUser); // Unblock a user by ID

// Book routes
router.post('/books', adminController.addBook); // Add a new book
router.put('/books/:id', adminController.updateBook); // Update a book by ID
router.delete('/books/:id', adminController.deleteBook); // Delete a book by ID

// Order routes
router.get('/orders', adminController.manageOrders); // Get all orders

module.exports = router;
