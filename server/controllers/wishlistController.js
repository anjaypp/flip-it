const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
const logger = require('../config/logger');

exports.addToWishlist = async (req, res) => {
    try{
    const { bookId } = req.body;
    const user = await userModel.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Only wishlist a book if it's not in the user's wishlist
    if(!user.wishlist.includes(bookId)){
        user.wishlist.push(bookId);
        await user.save();
        logger.info('Book added to wishlist', { userId: req.user._id, bookId: bookId });
        res.status(200).json({ message: 'Book added to wishlist successfully', wishlist: user.wishlist });
    }

    }
    catch(err){
        logger.error('Error adding book to wishlist', { error: err.message });
        res.status(500).json({ message: 'Error adding book to wishlist' });
    }
};

// Remove a book from the user's wishlist
exports.removeFromWishlist = async (req, res) => {
    try{
        const { id: userId, bookId } = req.params;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the book from the user's wishlist
        user.wishlist = user.wishlist.filter(item => item.toString() !== bookId);
        await user.save();

        logger.info('Book removed from wishlist', { userId: userId, bookId: bookId });
        res.status(200).json({ message: 'Book removed from wishlist successfully', wishlist: user.wishlist });
    }
    catch(err){
        logger.error('Error removing book from wishlist', { error: err.message });
        res.status(500).json({ message: 'Error removing book from wishlist' });
    }
};  

// Get the user's wishlist
exports.getWishlist = async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await userModel.findById(userId).populate('wishlist.book');
        
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        logger.info('Wishlist retrieved successfully', { userId: req.user._id });
        res.status(200).json({ wishlist: user.wishlist });
    }
    catch(err){
        logger.error('Error retriving wishlist', {error: err.message});
        res.status(500).json({ message: 'Error retriving wishlist' });
    }
     };

