const User = require('../models/userModel');
const Book = require('../models/bookModel');

// Add a book to the cart
exports.addToCart = async (req, res) => {
    try {
        
        const { id } = req.params;
        const { bookId } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const alreadyInCart = user.cart.some(item => item.book.toString() === bookId);
        if (alreadyInCart) return res.status(400).json({ message: 'Book is already in the cart' });

        user.cart.push({ book: bookId });
        await user.save();

        res.status(200).json({ message: 'Book added to cart successfully', cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: 'Failed to add book to cart', error: err.message });
    }
};

// Remove a book from the cart
exports.removeFromCart = async (req, res) => {
    try {
        const { id, bookId } = req.params;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.cart = user.cart.filter(item => item.book.toString() !== bookId);
        await user.save();

        res.status(200).json({ message: 'Book removed from cart successfully', cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: 'Failed to remove book from cart', error: err.message });
    }
};

// Get the user's cart
exports.getCart = async (req, res) => {
    try {
        const { id } = req.params;  // Extract userId from the URL parameters

        // Retrieve user and populate the book field in the cart
        const user = await User.findById(id).populate('cart.book');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    
        res.status(200).json({ cart: user.cart });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching cart items" });
    }
};

