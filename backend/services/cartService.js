const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ADD TO CART
const addToCart = async (userId, productId, qty) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, cartItems: [] });
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId
  );

  if (qty < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const currentQty = itemIndex > -1 ? cart.cartItems[itemIndex].qty : 0;
  const desiredQty = currentQty + qty;

  if (desiredQty > product.countInStock) {
    throw new Error(
      `Only ${product.countInStock - currentQty} item${product.countInStock - currentQty === 1 ? "" : "s"} available in stock`
    );
  }

  if (itemIndex > -1) {
    cart.cartItems[itemIndex].qty = desiredQty;
  } else {
    cart.cartItems.push({
      product: productId,
      name: product.name,
      qty,
      price: product.price,
      image: product.image,
    });
  }

  return await cart.save();
};

// GET CART
const getCart = async (userId) => {
  return await Cart.findOne({ user: userId }).populate("cartItems.product");
};

// REMOVE ITEM
const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new Error("Cart not found");

  cart.cartItems = cart.cartItems.filter(
    (item) => item.product.toString() !== productId
  );

  return await cart.save();
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
};