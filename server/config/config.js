const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  db_URI: process.env.DB_URI,
  node_env: process.env.NODE_ENV || "development",
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "1d"
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET
  },
  
};

module.exports = config;
