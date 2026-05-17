const orderService = require('../services/orderService');
const { sendResponse } = require('../utils/response');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (User)
const createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return sendResponse(res, 400, false, 'No order items');
    }

    const orderData = await orderService.createOrder({
      userId: req.user.id,
      orderItems,
      totalPrice,
    });

    sendResponse(res, 201, true, 'Order placed successfully', orderData);
  } catch (error) {
    sendResponse(res, 500, false, error.message, null, error.stack);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private (User)
const getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUser(req.user.id);

    sendResponse(res, 200, true, 'Orders fetched successfully', orders);
  } catch (error) {
    sendResponse(res, 500, false, error.message, null, error.stack);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);

    if (order.user.toString() !== req.user.id) {
  return sendResponse(res, 403, false, "Not authorized");
}

    sendResponse(res, 200, true, 'Order fetched successfully', order);
  } catch (error) {
    sendResponse(res, 500, false, error.message, null, error.stack);
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const updatedOrder = await orderService.markOrderAsPaid(req.params.id);

    sendResponse(res, 200, true, 'Order marked as paid', updatedOrder);
  } catch (error) {
    sendResponse(res, 500, false, error.message, null, error.stack);
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private (Admin)
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await orderService.markOrderAsDelivered(req.params.id);

    sendResponse(res, 200, true, "Order delivered", order);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    sendResponse(res, 200, true, 'All orders fetched', orders);

    if (req.user.role !== "admin") {
  return sendResponse(res, 403, false, "Admin only");
}
  } catch (error) {
    sendResponse(res, 500, false, error.message, null, error.stack);
  }
};

// @desc    Checkout
// @route   POST /api/orders/checkout
// @access  Private (User)
const checkoutOrder = async (req, res) => {
  try {
    const order = await orderService.checkout(req.user.id);
    sendResponse(res, 200, true, "Order placed from cart,Checkout successful", order);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};


module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
  checkoutOrder,
};