const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');


router.get('/books', bookController.getAllBooks);
router.get('/book/:id', bookController.getOneBook);
router.post('/preview', bookController.getEbookPreview);

module.exports = router;