const express = require("express");
const router = express.Router();

const { getDashboard } = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");
const { getMonthlyRevenue } = require("../controllers/dashboardController");
const { getTopProducts } = require("../controllers/dashboardController");
const { getRecentOrders } = require("../controllers/dashboardController");

router.get("/", protect, adminOnly, getDashboard);

router.get("/revenue", protect, adminOnly, getMonthlyRevenue);
router.get("/top-products", protect, adminOnly, getTopProducts);
router.get("/recent-orders", protect, adminOnly, getRecentOrders);

module.exports = router;