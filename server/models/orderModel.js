const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    books:[{
        book:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        },
        quantity:{
            type:Number,
            default:1
        }
    }],
    totalAmount:{
        type:Number,
        default:0
    },
    paymentMethod: String,
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    }
});
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;