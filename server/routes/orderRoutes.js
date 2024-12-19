const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.post('/place-order', orderController.placeOrder);
router.post('/verify-payment', orderController.verifyPayment);
router.get('/get-razorpay-key', orderController.getRazorpayKey);

module.exports = router;
