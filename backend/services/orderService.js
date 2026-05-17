const Order = require("../models/Order")
const Cart = require('../models/Cart');

// 🛒 Create Order
const createOrder = async ({ userId, orderItems, totalPrice }) => {
  const order = new Order({
    user: userId,
    orderItems,
    totalPrice,
    isPaid: false,
    paidAt: null,
  });

  const createdOrder = await order.save();
  return createdOrder;
};

// 👤 Get Orders by User
const getOrdersByUser = async (userId) => {
  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
  return orders;
};

// 🔍 Get Order by ID
const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId).populate(
    'user',
    'name email'
  );

  return order;
};

// 💳 Mark Order as Paid
const markOrderAsPaid = async (orderId) => {
  console.log("Incoming Order ID:", orderId);

  const order = await Order.findById(orderId);
console.log("Order Found:", order);
  if (!order) {
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  return updatedOrder;
};

//mark order as delivered
const markOrderAsDelivered = async (orderId) => {
  const order = await Order.findById(orderId);
console.log("Order ID:", orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  order.isDelivered = true;
  order.deliveredAt = new Date();

  const updatedOrder = await order.save();

  return updatedOrder;
};

// 📊 Get All Orders (Admin)
const getAllOrders = async () => {
  const orders = await Order.find({})
    .populate('user', 'id name')
    .sort({ createdAt: -1 });

  return orders;
};

const checkout = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  // total price calculate
  const totalPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
// create order
  const order = await Order.create({
    user: userId,
    orderItems: cart.cartItems,
    totalPrice,
  });

  // clear cart
  cart.cartItems = [];
  await cart.save();

  return order;
};

module.exports = {
  createOrder,
  getOrdersByUser,
  getOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  getAllOrders,
  checkout,
};