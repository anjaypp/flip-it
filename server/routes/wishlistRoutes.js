const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');

router.post('/:id/add-wishlist', wishlistController.addToWishlist);
router.get('/:id/get-wishlist', wishlistController.getWishlist);
router.delete('/:id/remove-wishlist/:bookId', wishlistController.removeFromWishlist);

module.exports = router;