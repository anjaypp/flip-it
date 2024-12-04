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
    public_id: { type: String, required: true },
    url: { type: String, required: true },
    secure_url: { type: String },
    format: { type: String },
    width: { type: Number },
    height: { type: Number }
  },
  description: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true
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
  avgRating: {
    type: Number,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  bookFile: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
    secure_url: { type: String },
    format: { type: String, required: true }, // pdf, epub, etc.
    size: { type: Number },
    pages: { type: Number }
  },
  audioBookFile: {
    public_id: { type: String },
    url: { type: String },
    secure_url: { type: String },
    format: { type: String }, // mp3, wav, etc.
    duration: { type: Number }, // Audio duration in seconds
    size: { type: Number }
  },
  formats: [{
    type: String,
    enum: ["pdf", "epub", "mobi", "audio"]
  }]
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
