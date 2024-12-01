const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true
  },
  coverImage: {
    public_id: String,
    url: String,
    secure_url: String,
    format: String,
    width: Number,
    height: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isbn:{
    type:String,
    required:true
  },
  categories: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountedPrice: {
    type: Number,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  publicationDate: {
    type: Date,
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  avgRating: Number,
  ratingCount: Number,
  bookFile: {
    public_id: String, // Cloudinary public id
    url: String,        //Cloudinary URl
    secure_url: String, //Cloudinary secure URL
    format: String, // pdf, epub, etc.
    size: Number, // File size
    pages: Number,
    required: true
  },
  audioBookFile: {
    public_id: String,
    url: String,
    secure_url: String,
    format: String,      // mp3, wav, etc.
    duration: Number,    // Audio duration in seconds
    size: Number 
  },
  formats: [{
    type: String,
    enum: ["pdf", "epub", "mobi", 'audio']
  }]
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;