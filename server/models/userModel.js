const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    publicId: String,
    url: String
  },
  googleId: {
    type: String,
    unique: true
  },

  // User Role and Status
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpiry: {
    type: Date,
    default: null
  },

  // Library and Purchased Books
  purchasedBooks: [
    {
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
      },
      purchasedDate: {
        type: Date,
        default: Date.now
      }
    }
  ],
  

  // Cart
  cart: [
    {
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // Wishlist
  wishlist: [
    {
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
