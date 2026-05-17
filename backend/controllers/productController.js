const productService = require('../services/productService');
const { sendResponse } = require('../utils/response');
const Product = require('../models/Product');

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildRegex = (text, exact = false) => {
  const normalized = text.trim().replace(/\s+/g, ' ');
  if (!normalized) return null;
  const escaped = escapeRegex(normalized);
  const pattern = exact ? `^${escaped}$` : escaped.split(' ').join('.*');
  return new RegExp(pattern, 'i');
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const keyword = req.query.keyword?.trim() || '';
  const category = req.query.category?.trim() || '';
  const brand = req.query.brand?.trim() || '';
  const minPrice = Number.isFinite(Number(req.query.minPrice))
    ? parseInt(req.query.minPrice, 10)
    : undefined;
  const maxPrice = Number.isFinite(Number(req.query.maxPrice))
    ? parseInt(req.query.maxPrice, 10)
    : undefined;
  const rating = Number.isFinite(Number(req.query.rating))
    ? parseFloat(req.query.rating)
    : undefined;

  const filters = [];

  if (keyword) {
    const keywordRegex = buildRegex(keyword);
    filters.push({
      $or: [
        { name: { $regex: keywordRegex } },
        { description: { $regex: keywordRegex } },
        { category: { $regex: keywordRegex } },
        { brand: { $regex: keywordRegex } },
      ],
    });
  }

  if (category) {
    filters.push({
      category: {
        $regex: `^${escapeRegex(category)}$`,
        $options: 'i',
      },
    });
  }

  if (brand) {
    filters.push({
      brand: {
        $regex: `^${escapeRegex(brand)}$`,
        $options: 'i',
      },
    });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter = {};
    if (minPrice !== undefined) priceFilter.$gte = minPrice;
    if (maxPrice !== undefined) priceFilter.$lte = maxPrice;
    filters.push({ price: priceFilter });
  }

  if (rating !== undefined) {
    filters.push({ rating: { $gte: rating } });
  }

  const matchQuery = filters.length > 0 ? { $and: filters } : {};
  const pipeline = [{ $match: matchQuery }];

  if (keyword) {
    const exactRegex = buildRegex(keyword, true);
    const partialRegex = buildRegex(keyword, false);

    pipeline.push({
      $addFields: {
        relevance: {
          $add: [
            {
              $cond: [
                { $regexMatch: { input: '$name', regex: exactRegex } },
                120,
                0,
              ],
            },
            {
              $cond: [
                { $regexMatch: { input: '$brand', regex: exactRegex } },
                80,
                0,
              ],
            },
            {
              $cond: [
                { $regexMatch: { input: '$category', regex: exactRegex } },
                70,
                0,
              ],
            },
            {
              $cond: [
                { $regexMatch: { input: '$name', regex: partialRegex } },
                30,
                0,
              ],
            },
            {
              $cond: [
                { $regexMatch: { input: '$description', regex: partialRegex } },
                20,
                0,
              ],
            },
            {
              $cond: [
                { $regexMatch: { input: '$brand', regex: partialRegex } },
                15,
                0,
              ],
            },
            {
              $cond: [
                { $regexMatch: { input: '$category', regex: partialRegex } },
                10,
                0,
              ],
            },
          ],
        },
      },
    });

    pipeline.push({
      $sort: {
        relevance: -1,
        rating: -1,
        price: 1,
      },
    });
  } else {
    pipeline.push({ $sort: { rating: -1, price: 1 } });
  }

  const products = await Product.aggregate(pipeline).exec();
  res.json({ success: true, data: products });
};

// @desc    Get search suggestions (smart search)
// @route   GET /api/products/search/suggestions
// @access  Public
const getSearchSuggestions = async (req, res) => {
  try {
    const keyword = req.query.keyword?.trim() || '';

    if (!keyword || keyword.length < 2) {
      return res.json({ success: true, data: { products: [], categories: [], brands: [] } });
    }

    const searchRegex = buildRegex(keyword);

    const productMatches = await Product.find({
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { brand: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
      ],
    })
      .select('name price category brand image')
      .limit(6)
      .lean();

    const categoryMatches = await Product.aggregate([
      {
        $match: {
          $or: [
            { category: { $regex: searchRegex } },
            { name: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { brand: { $regex: searchRegex } },
          ],
        },
      },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 },
      { $project: { _id: 0, type: 'category', value: '$_id' } },
    ]).exec();

    const brandMatches = await Product.aggregate([
      {
        $match: {
          $or: [
            { brand: { $regex: searchRegex } },
            { name: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { category: { $regex: searchRegex } },
          ],
        },
      },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 4 },
      { $project: { _id: 0, type: 'brand', value: '$_id' } },
    ]).exec();

    res.json({
      success: true,
      data: {
        products: productMatches.map((product) => ({ type: 'product', ...product })),
        categories: categoryMatches.filter((item) => item.value).map((item) => item),
        brands: brandMatches.filter((item) => item.value).map((item) => item),
      },
    });
  } catch (error) {
    console.error('Search suggestions error:', error);
    res.json({ success: true, data: { products: [], categories: [], brands: [] } });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    sendResponse(res, 200, true, 'Product fetched successfully', product);
  } catch (error) {
    sendResponse(res, 404, false, error.message);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin or Seller
const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const userId = req.user.id;
    
    const product = await productService.createProduct(productData, userId);
    sendResponse(res, 201, true, 'Product created successfully', product);
  } catch (error) {
    sendResponse(res, 400, false, error.message);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin or Seller
const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(
      req.params.id,
      req.body,
      req.user.id,
      req.user.role
    );
    sendResponse(res, 200, true, 'Product updated successfully', product);
  } catch (error) {
    sendResponse(res, 400, false, error.message);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin or Seller
const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id, req.user.id, req.user.role);
    sendResponse(res, 200, true, 'Product deleted successfully');
  } catch (error) {
    sendResponse(res, 400, false, error.message);
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendResponse(res, 404, false, "Product not found");
    }

    const alreadyReviewed = product.reviews.some(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return sendResponse(res, 400, false, "You have already reviewed this product");
    }

    const parsedRating = Number(rating);
    if (![1, 2, 3, 4, 5].includes(parsedRating)) {
      return sendResponse(res, 400, false, "Rating must be between 1 and 5");
    }

    if (!comment || comment.trim().length < 5) {
      return sendResponse(res, 400, false, "Please write a review with at least 5 characters");
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: parsedRating,
      comment,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    sendResponse(res, 200, true, "Review added successfully", product);
  } catch (error) {
    sendResponse(res, 400, false, error.message);
  }
};

module.exports = {
  getProducts,
  getSearchSuggestions,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
};
