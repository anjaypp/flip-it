const express = require('express');
const adminController = require('../controllers/adminController');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

// User routes
router.get('/users', adminController.getAllUsers); // Get all users
router.put('/users/block/:id', adminController.blockUser); // Block a user by ID
router.put('/users/unblock/:id', adminController.unblockUser); // Unblock a user by ID

// Book routes
router.post("/addBook", upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "bookFile", maxCount: 1 },
  { name: "audioBookFile", maxCount: 1 }
]), (req, res, next) => {
  console.log("Add Book route hit");
  next();
}, adminController.addBook);



  router.put("/updateBook/:id", upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
    { name: "audioBookFile", maxCount: 1 }
  ]), adminController.updateBook);

router.delete('/deleteBook/:id', adminController.deleteBook); // Delete a book by ID

// Order routes
router.get('/orders', adminController.manageOrders); // Get all orders

module.exports = router;
