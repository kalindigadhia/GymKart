const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/razorpay", createOrder);


module.exports = router;