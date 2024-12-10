const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/add-to-cart/:id', cartController.addToCart);
router.delete('/remove-from-cart/:id/:bookId', cartController.removeFromCart);
router.get('/get-cart/:id', cartController.getCart);


module.exports = router;