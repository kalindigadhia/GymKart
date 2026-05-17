const Product = require('../models/Product');

const getProducts = async () => {
  return await Product.find().populate('user', 'name email');
};

const getProductById = async (id) => {
  const product = await Product.findById(id).populate('user', 'name email');
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

const createProduct = async (productData, userId) => {
  productData.user = userId;
  return await Product.create(productData);
};

const updateProduct = async (id, productData, userId, userRole) => {
  let product = await Product.findById(id);

  if (!product) {
    throw new Error('Product not found');
  }
  //Object.assign(product,productData);
  //return await product.save();

  // Ensure user owns product or is admin
  if (product.user.toString() !== userId && userRole !== 'admin') {
    throw new Error('User not authorized to update this product');
  }

  product = await Product.findByIdAndUpdate(id, productData, {
    new: true,
    runValidators: true,
  });

  return product;
};

const deleteProduct = async (id, userId, userRole) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error('Product not found');
  }

  // Ensure user owns product or is admin
  if (product.user.toString() !== userId && userRole !== 'admin') {
    throw new Error('User not authorized to delete this product');
  }

  await product.deleteOne();
  return true;
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
