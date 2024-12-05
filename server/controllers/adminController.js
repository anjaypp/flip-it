const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");
const logger = require("../config/logger");

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        
        if (users.length === 0) {
            logger.error('No users found');
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json({ message: 'Users retrieved successfully', users });
        
    } catch (err) {
        logger.error('Error getting all users', { error: err.message });
        res.status(500).json({ message: 'Error getting all users' });
    }
};

// To block a user
exports.blockUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findByIdAndUpdate(userId, { isActive: false }, { new: true });
        
        if (!user) {
            logger.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ message: 'User blocked successfully!', user });
        
    } catch (err) {
        logger.error('Error blocking user', { error: err.message });
        res.status(500).json({ message: 'Error blocking user' });
    }
};

// To unblock a user
exports.unblockUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findByIdAndUpdate(userId, { isActive: true }, { new: true });
        
        if (!user) {
            logger.error('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ message: 'User unblocked successfully!', user });
        
    } catch (err) {
        logger.error('Error unblocking user', { error: err.message });
        res.status(500).json({ message: 'Error unblocking user' });
    }
};

// Add a book
exports.addBook = async (req, res) => {
    try {
        const book = new bookModel(req.body);
        await book.save();

        res.status(201).json({ message: 'Book added successfully!', book });
        
    } catch (err) {
        logger.error('Error adding book', { error: err.message });
        res.status(500).json({ message: 'Error adding book' });
    }
};

// Update a book
exports.updateBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await bookModel.findByIdAndUpdate(bookId, req.body, { new: true, runValidators: true });
        
        if (!book) {
            logger.error('Book not found');
            return res.status(404).json({ message: 'Book not found' });
        }
        
        res.status(200).json({ message: 'Book updated successfully!', book });
        
    } catch (err) {
        logger.error('Error updating book', { error: err.message });
        res.status(500).json({ message: 'Error updating book' });
    }
};

// Delete a book
exports.deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await bookModel.findByIdAndDelete(bookId);
        
        if (!book) {
            logger.error('Book not found');
            return res.status(404).json({ message: 'Book not found' });
        }
        
        res.status(200).json({ message: 'Book deleted successfully!', book });
        
    } catch (err) {
        logger.error('Error deleting book', { error: err.message });
        res.status(500).json({ message: 'Error deleting book' });
    }
};

// Manage orders
exports.manageOrders = async (req, res) => {
    try {
        const orders = await orderModel.find();

        if (orders.length === 0) {
            logger.error('No orders found');
            return res.status(404).json({ message: 'No orders found' });
        }
        
        logger.info('All orders found');
        res.status(200).json({ message: 'Orders retrieved successfully', orders });
        
    } catch (err) {
        logger.error('Error getting orders', { error: err.message });
        res.status(500).json({ message: 'Error getting orders' });
    }
};
