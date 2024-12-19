const orderModel = require("../models/orderModel");
const bookModel = require("../models/bookModel");
const razorpay = require("../config/razorpay");
const config = require("../config/config");
const logger = require("../config/logger");

//Place an order
exports.placeOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;

    // Validate request body
    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // Validate Razorpay configuration
    if (!razorpay.orders?.create) {
      logger.error("Razorpay orders.create is not defined");
      return res.status(500).json({
        success: false,
        message: "Payment configuration error"
      });
    }

    // Ensure books exist
    const uniqueBooks = [...new Set(items.map((item) => item.bookId))];
    const bookDetails = await bookModel.find({ _id: { $in: uniqueBooks } });

    if (bookDetails.length !== items.length) {
      return res.status(400).json({ message: "Some books do not exist" });
    }

    // Calculate total price
    const totalPrice = items.reduce((total, item) => total + item.price, 0);

    // Save order to database with status as 'pending'
    const newOrder = await orderModel.create({
      userId,
      items: bookDetails.map((book) => ({
        bookId: book._id,
        price: book.price
      })),
      totalAmount: totalPrice,
      paymentStatus: "pending"
    });

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPrice * 100, // Amount in paise
      currency: "INR",
      receipt: newOrder._id.toString()
    });

    res.status(201).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      orderId: newOrder._id
    });
  } catch (error) {
    logger.error("Error in placeOrder", { error: error.message });
    res.status(500).json({
      success: false,
      message: "Error in placeOrder",
      error: error.message
    });
  }
};

//Verifying the payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Find the original order
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Prevent duplicate updates
    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified"
      });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      // Update order status to failed
      await orderModel.findByIdAndUpdate(orderId, { paymentStatus: "failed" });

      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    // Verify payment status with Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    logger.info("Razorpay payment fetched", { payment });

    if (payment.status !== "captured") {
      // Update order status to failed
      await orderModel.findByIdAndUpdate(orderId, { paymentStatus: "failed" });

      return res.status(400).json({
        success: false,
        message: "Payment not successful"
      });
    }

    // Update order status to paid
    await orderModel.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id
    });

    // Return success response with metadata
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      orderId: orderId,
      paymentId: razorpay_payment_id,
      amount: payment.amount / 100 // Convert paise to INR
    });
  } catch (error) {
    logger.error("Error in verifyPayment", { error: error.message });
    res.status(500).json({
      success: false,
      message: "Error in payment verification",
      error: error.message
    });
  }
};
exports.getRazorpayKey = async (req, res) => {
  try {
    res.status(200).json({ keyId: config.razorpay.keyId });
  } catch (error) {
    logger.error("Error in getRazorpayKey", { error: error.message });
    res.status(500).json({
      success: false,
      message: "Error in getting Razorpay key",
      error: error.message
    });
  }
};
