const cartService = require("../services/cartService");
const { sendResponse } = require("../utils/response");
const Cart = require("../models/Cart");

// ADD
const addItemToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const cart = await cartService.addToCart(
      req.user._id,
      productId,
      qty
    );

    sendResponse(res, 200, true, "Item added to cart", cart);
  } catch (error) {
    sendResponse(res, 400, false, error.message);
  }
};

// GET
const getUserCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user._id);

    sendResponse(res, 200, true, "Cart fetched", cart);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

// REMOVE
const removeItem = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  cart.cartItems = cart.cartItems.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  await cart.save();

  res.json({ success: true, message: "Item removed" });
};

// UPDATE QTY
const updateCartQty = async (req, res) => {
  const { qty } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "cartItems.product"
  );

  if (!cart) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  }

  const item = cart.cartItems.find(
  (item) => item.product._id.toString() === req.params.productId
);

  if (!item) {
    return res.status(404).json({ success: false, message: "Item not found in cart" });
  }

  if (qty > item.product.countInStock) {
    return res.status(400).json({
      success: false,
      message: `Only ${item.product.countInStock} item${item.product.countInStock === 1 ? "" : "s"} available in stock`,
    });
  }

  item.qty = qty;

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Quantity updated",
    cart,
  });
};


module.exports = {
  addItemToCart,
  getUserCart,
  removeItem,
  updateCartQty,
};