const dashboardService = require("../services/dashboardService");
const { sendResponse } = require("../utils/response");

const getDashboard = async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats();

    sendResponse(res, 200, true, "Dashboard stats", stats);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

const getMonthlyRevenue = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // month number → name convert
    const months = [
      "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const formatted = data.map((item) => ({
      month: months[item._id],
      revenue: item.total,
    }));

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",
          name: { $first: "$orderItems.name" },
          totalSold: { $sum: "$orderItems.qty" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard,getMonthlyRevenue,getTopProducts,getRecentOrders };