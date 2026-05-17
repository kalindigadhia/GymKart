const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

const getDashboardStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();

  const orders = await Order.find();

  const totalRevenue = orders.reduce(
    (acc, order) => acc + order.totalPrice,
    0
  );

  return {
    totalUsers,
    totalOrders,
    totalProducts,
    totalRevenue,
  };
};

module.exports = { getDashboardStats };