const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'books';
    let resourceType = 'raw';

    // Only allow PDF files
    if (file.mimetype === 'application/pdf') {
      folder = 'documents'; // Store PDFs in 'documents' folder
      resourceType = 'raw';
    } else {
      // Reject other file types, including EPUB and MOBI
      throw new Error('Only PDF files are allowed');
    }

    return {
      folder: folder,
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

module.exports = storage;
