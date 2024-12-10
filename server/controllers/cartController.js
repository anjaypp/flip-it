const userModel = require('../models/userModel');
const bookModel = require('../models/bookModel');
const logger = require('../config/logger');


exports.addToCart = async (req, res) => {
    try{
        const { bookId } = req.body;
        const userId = req.params.id;
        const user = await userModel.findById(userId);
        const book = await bookModel.findById(bookId);

        if (!user || !book) {
            return res.status(404).json({ message: 'User or book not found' });
        }

        // Check if the book is already in the user's cart
        const existingItem = user.cart.find(item => item.book.toString() === bookId);
        if (existingItem) {
            return res.status(400).json({ message: 'Book already in cart' });
        }

        // Add the book to the user's cart
        user.cart.push({ book: bookId, price: book.price });
        await user.save();
 
        logger.info('Book added to cart', { userId: req.user._id, bookId: bookId });
        res.status(200).json({ message: 'Book added to cart successfully', cart: user.cart });
    }
    catch(err){
        logger.error('Error adding book to cart', { error: err.message });
        res.status(500).json({ message: 'Error adding book to cart' });
    }
};

// Remove a book from the user's cart
exports.removeFromCart = async (req, res) => {
    try{
        const { id: userId, bookId } = req.params;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the book from the user's cart
        user.cart = user.filter(item => item.bookId.toString() !== bookId);

        await user.save();
        logger.info('Book removed from cart', { userId: userId, bookId: bookId });
        res.status(200).json({ message: 'Book removed from cart successfully', cart: user.cart });
    }
    catch(err){
        logger.error('Error removing book from cart', { error: err.message });
        res.status(500).json({ message: 'Error removing book from cart' });
    }
};

// Get the user's cart
exports.getCart = async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await userModel.findById(userId).populate('cart.book');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        logger.info ('Cart retrieved successfully', { userId: req.user._id });
        res.status(200).json({cart: user.cart });
    }
    catch(err){
        logger.error('Error getting cart', { error: err.message });
        res.status(500).json({ message: 'Error getting cart' });
    }
};
