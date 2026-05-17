const express = require('express');
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
  checkoutOrder,
} = require('../controllers/orderController');

const { protect } = require('../middlewares/authMiddleware');
const { adminOnly } = require('../middlewares/adminMiddleware');

router.get("/",protect,adminOnly,getAllOrders);

// 🛒 Create Order
// 👤 Get My Orders
router.route('/')
  .post(protect, createOrder)     // POST /api/orders
  .get(protect, getAllOrders);    // GET /api/orders (Admin)

//checkout
router.post("/checkout",protect,checkoutOrder);

// 👤 Get Logged-in User Orders
router.get('/myorders', protect, getMyOrders);

// 🔍 Get Order by ID
router.get('/:id', protect, getOrderById);

// 💳 Mark Order as Paid
router.put('/:id/pay', protect,adminOnly, updateOrderToPaid);

//mark order as delivered
router.put("/:id/deliver",protect,adminOnly,updateOrderToDelivered);


module.exports = router;