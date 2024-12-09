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
      const { title, author, description, isbn, categories, price, discountedPrice, publisher, publicationDate, tags } = req.body;
  
      // Extract file data
      const coverImage = req.files.coverImage?.[0];
      const bookFile = req.files.bookFile?.[0];
      const audioBookFile = req.files.audioBookFile?.[0]; // Extract audiobook file if it exists
  
      // Validate required files
      if (!coverImage || !bookFile) {
        return res.status(400).json({ message: "Both cover image and book file are required" });
      }
  
      // Prepare book document
      const newBook = new bookModel({
        title,
        author,
        description,
        isbn,
        categories,
        price,
        discountedPrice,
        publisher,
        publicationDate,
        tags,
        coverImage: {
          public_id: coverImage.filename,
          url: coverImage.path,
          secure_url: coverImage.secure_url,
          format: coverImage.format,
          width: coverImage.width,
          height: coverImage.height,
        },
        bookFile: {
          public_id: bookFile.filename,
          url: bookFile.path,
          secure_url: bookFile.secure_url,
          format: bookFile.format,
          size: bookFile.size,
        },
        // Handle audioBookFile if it exists
        audioBookFile: audioBookFile ? {
          public_id: audioBookFile.filename,
          url: audioBookFile.path,
          secure_url: audioBookFile.secure_url,
          format: audioBookFile.mimetype,
          size: audioBookFile.size,
        } : undefined,
      });
  
      // Save the new book document in the database
      await newBook.save();
      res.status(201).json({ message: "Book added successfully!", book: newBook });
    } catch (err) {
      logger.error("Error adding book", { error: err.message });
      res.status(500).json({ message: "Error adding book", error: err.message });
    }
  };

// Update a book
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id; // Extract the book ID from the request parameters
    const { title, author, description, isbn, categories, price, discountedPrice, publisher, publicationDate, tags } = req.body;

    // Extract file data
    const coverImage = req.files.coverImage?.[0];
    const bookFile = req.files.bookFile?.[0];
    const audioBookFile = req.files.audioBookFile?.[0]; // Extract audiobook file if it exists

    // Find the existing book in the database
    const book = await bookModel.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Update the fields of the book model
    book.title = title || book.title;
    book.author = author || book.author;
    book.description = description || book.description;
    book.isbn = isbn || book.isbn;
    book.categories = categories || book.categories;
    book.price = price || book.price;
    book.discountedPrice = discountedPrice || book.discountedPrice;
    book.publisher = publisher || book.publisher;
    book.publicationDate = publicationDate || book.publicationDate;
    book.tags = tags || book.tags;

    // If cover image is provided, update it
    if (coverImage) {
      book.coverImage = {
        public_id: coverImage.filename,
        url: coverImage.path,
        secure_url: coverImage.secure_url,
        format: coverImage.format,
        width: coverImage.width,
        height: coverImage.height,
      };
    }

    // If book file is provided, update it
    if (bookFile) {
      book.bookFile = {
        public_id: bookFile.filename,
        url: bookFile.path,
        secure_url: bookFile.secure_url,
        format: bookFile.format,
        size: bookFile.size,
      };
    }

    // If audiobook file is provided, update it
    if (audioBookFile) {
      book.audioBookFile = {
        public_id: audioBookFile.filename,
        url: audioBookFile.path,
        secure_url: audioBookFile.secure_url,
        format: audioBookFile.mimetype,
        size: audioBookFile.size
      };
    }

    // Save the updated book in the database
    await book.save();
    res.status(200).json({ message: "Book updated successfully!", book });
  } catch (err) {
    logger.error("Error updating book", { error: err.message });
    res.status(500).json({ message: "Error updating book", error: err.message });
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
