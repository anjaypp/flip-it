const razorpay = require('razorpay');
const config = require('./config');

const payment = new razorpay({
    key_id: config.razorpay.keyId,
    key_secret: config.razorpay.keySecret
});

module.exports = payment;