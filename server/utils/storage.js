const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        
        //Determine resource type and folder based on file type
        let folder = 'books';
        let resourceType = 'raw';

        if(file.mimetype.startsWith('image/')) {
            folder = 'images';
            resourceType = 'image';
        }
        else if(file.mimetype.startsWith('audio/')) {
             folder = 'audio';
             resourceType = 'raw';
        }
        else if(file.mimetype.startsWith('application/pdf' || 'application/epub+zip' || 'application/mobi')) {
            folder = 'documents';
            resourceType = 'raw';
        }

        return {
            folder: folder,
            resource_type: resourceType,
            public_id: `${Date.now()}-${file.originalname}`,
        };
    },
});

module.exports = storage;