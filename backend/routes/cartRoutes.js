const express = require("express");
const router = express.Router();

const {
  addItemToCart,
  getUserCart,
  removeItem,
  updateCartQty,
} = require("../controllers/cartController");

const { protect } = require("../middlewares/authMiddleware");

router.post("/", protect, addItemToCart);
router.get("/", protect, getUserCart);
router.delete("/:productId", protect, removeItem);
router.put("/:productId", protect, updateCartQty);

module.exports = router;