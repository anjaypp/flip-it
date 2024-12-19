const express = require('express');
const pdf = require('pdf-parse');
const axios = require('axios');
const bookModel  = require('../models/bookModel');
const { getOptimizedImageUrl } = require('../utils/cloudinary');
const logger = require('../config/logger');

exports.getAllBooks = async (req, res) => {
    try {
        // Capture the search term from the query
        const searchTerm = req.query.searchTerm?.trim() || "";

        // Set a base query to start with
        const query = {};

        // Log the incoming request details
        logger.info("Received request to fetch books", { searchTerm });

        // If there's a search term, modify the query to filter by title or author
        if (searchTerm) {
            query.$or = [
                { title: { $regex: searchTerm, $options: "i" } },
                { author: { $regex: searchTerm, $options: "i" } },
            ];
        }

        // Fetch the books based on the query, sorted by createdAt in descending order
        const books = await bookModel.find(query).sort({ createdAt: -1 });

        // Add optimized image URLs for the cover images
        const booksWithOptimizedImages = books.map(book => ({
        ...book.toObject(),
        coverImage: {
          ...book.coverImage,
          optimizedUrl: getOptimizedImageUrl(book.coverImage.public_id),
        }
        }));

        if (booksWithOptimizedImages.length > 0) {
            logger.info("Books fetched successfully", { count: books.length });
        } else {
            logger.warn("No books found for the search term", { searchTerm });
        }

        // Return the books in the response
        res.status(200).json({
            success: true,
            data: booksWithOptimizedImages
        });
    } catch (error) {
        // Log the error
        logger.error("Failed to fetch books", { error: error.message });

        // Handle errors
        res.status(500).json({
            success: false,
            message: "Failed to fetch books",
            error: error.message
        });
    }
};

//Display a specific book
exports.getOneBook = async (req, res) => {
    try {
        const book = await bookModel.findById(req.params.id);

        if (!book) {
            logger.warn("Book not found", { id: req.params.id });
            return res.status(404).json({ message: "Book not found" });
        }

        //Add optimized image URL for the cover image
        const bookWithOptimizedImage = {
            ...book.toObject(),
            coverImage:{
                ...book.coverImage,
                optimizedUrl: getOptimizedImageUrl(book.coverImage.public_id)
            },
        };

        logger.info("Book fetched successfully", { id: req.params.id });
        res.status(200).json({ success: true, data: bookWithOptimizedImage });
}
    catch (error) {
        logger.error("Failed to fetch book", { id: req.params.id, error: error.message });
        res.status(500).json({ success: false, message: "Failed to fetch book", error: error.message });
    }
};

exports.getEbookPreview = async (req, res) => {
    try {
      const { ebookUrl } = req.body;
  
      // Fetch the PDF file from Cloudinary URL
      const response = await axios({
        method: 'get',
        url: ebookUrl,
        responseType: 'arraybuffer',  // Use arraybuffer to handle binary data
      });
  
      // Convert to base64 and return as preview
      const base64Pdf = response.data.toString('base64');
      const totalPages = await pdf(response.data).then((data) => data.numpages); // Extract total pages from PDF
  
      return res.json({
        preview: base64Pdf,
        totalPages: totalPages,
        previewPages: Math.min(totalPages, 15), // Show first 15 pages
      });
    } catch (error) {
      console.error('Ebook preview error:', error);
      res.status(500).json({
        message: 'Error generating ebook preview',
        error: error.message,
      });
    }
  };
  