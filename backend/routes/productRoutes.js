const express = require('express');
const router = express.Router();
const {
  getProducts,
  getSearchSuggestions,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { adminOnly } = require("../middlewares/adminMiddleware");

// Smart search suggestions - must come before /:id route
router.get('/search/suggestions', getSearchSuggestions);

router
  .route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

router.post("/:id/reviews", protect, addReview);

module.exports = router;
