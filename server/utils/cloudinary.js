const cloudinary = require('cloudinary').v2;

//Function to get an optimized URL
const getOptimizedImageUrl = (publicId, width = 400, height = 500) => {
    return cloudinary.url(publicId, {     // Resize height
      crop: 'fill',        // Crop image to fit the dimensions
      gravity: 'auto',     // Automatically adjust the gravity for the best fit
      format: 'webp',      // Convert to WebP
      quality: 'auto',      // Automatically adjust quality for best performance
      secure: true
    });
  };

  module.exports = { getOptimizedImageUrl };