

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { useCart } from "../context/CartContext";
import Toast from "../components/Toast";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateCartCount } = useCart();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ open: true, message, type });
  };

  const handleCloseToast = () => {
    setToast((current) => ({ ...current, open: false }));
  };

  const loadProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data.data);
    } catch (error) {
      showToast(error?.response?.data?.message || "Unable to load product", "error");
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const submitReview = async () => {
    try {
      const res = await API.post(`/products/${id}/reviews`, {
        rating,
        comment,
      });

      showToast("Review added ✅", "success");
      setProduct(res.data.data);
      setRating(5);
      setComment("");
    } catch (error) {
      showToast(error?.response?.data?.message || "Error adding review ❌", "error");
    }
  };

  const handleAddToCart = async () => {
    if (!product) return false;
    if (product.countInStock === 0) {
      showToast("This product is currently out of stock", "error");
      return false;
    }

    try {
      await API.post("/cart", { productId: product._id, qty: 1 });
      updateCartCount();
      showToast("Added to cart ✅", "success");
      return true;
    } catch (error) {
      showToast(error?.response?.data?.message || "Unable to add to cart", "error");
      return false;
    }
  };

  const handleBuyNow = async () => {
    const added = await handleAddToCart();
    if (added) {
      navigate("/checkout");
    }
  };


  if (!product) return <h1>Loading...</h1>;

  return (
  <div className="bg-gray-100 min-h-screen py-8">
  <Toast open={toast.open} type={toast.type} message={toast.message} onClose={handleCloseToast} />
  <div className="max-w-7xl mx-auto bg-white p-8 rounded-2xl shadow-lg">

    <div className="grid md:grid-cols-2 gap-10">

      {/* LEFT IMAGE */}
      <div className="bg-gray-50 p-6 rounded-2xl flex items-center justify-center">
        <img
          src={`https://gymkart-2.onrender.com/images/${product.image}`}
          alt={product.name}
          className="h-[450px] object-contain"
        />
      </div>

      {/* RIGHT INFO */}
      <div>

        {/* Title */}
        <h1 className="text-3xl font-bold leading-snug">
          {product.name}
        </h1>

        <p className="text-gray-500 text-base mt-1">
          {product.brand}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-3 mt-3">
          <span className="bg-green-500 text-white px-3 py-1 text-sm rounded">
            {product.rating?.toFixed(1)} ★
          </span>
          <span className="text-gray-500 text-base">
            {product.numReviews} Reviews
          </span>
        </div>

        {/* Price */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-3xl font-bold">₹{product.price?.toLocaleString('en-IN')}</span>
          {product.discountPrice ? (
            <span className="text-gray-400 line-through text-lg">
              ₹{product.discountPrice?.toLocaleString('en-IN')}
            </span>
          ) : null}
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              product.countInStock > 0
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
            }`}
          >
            {product.countInStock > 0
              ? `${product.countInStock} left in stock`
              : "Out of stock"}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            className={`flex-1 py-3 rounded-xl text-lg font-semibold transition ${
              product.countInStock === 0
                ? "border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                : "border border-orange-500 text-orange-500 hover:bg-orange-50"
            }`}
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
          >
            Add to Cart
          </button>

          <button
            className={`flex-1 py-3 rounded-xl text-lg font-semibold text-white transition ${
              product.countInStock === 0
                ? "bg-orange-200 text-orange-700 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
            onClick={handleBuyNow}
            disabled={product.countInStock === 0}
          >
            Buy Now
          </button>
        </div>

        {/* Description */}
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold text-lg mb-2">
            Description
          </h3>
          <p className="text-base text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>

      </div>
    </div>
    
    {/* REVIEW SECTION */}
    <div className="mt-10 grid md:grid-cols-2 gap-8">

  {/* FORM */}
  <div className="bg-gray-50 p-6 rounded-xl">
    <h2 className="text-xl font-bold mb-3">Write a Review</h2>

    <select
      value={rating}
      onChange={(e) => setRating(Number(e.target.value))}
      className="border p-3 w-full mb-3 text-base"
    >
      <option value="5">5 - Excellent</option>
      <option value="4">4 - Good</option>
      <option value="3">3 - Average</option>
      <option value="2">2 - Bad</option>
      <option value="1">1 - Poor</option>
    </select>

    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      className="border p-3 w-full text-base"
      placeholder="Write review..."
    />

    <button onClick={submitReview} className="bg-orange-500 text-white px-5 py-3 mt-3 rounded-lg text-base">
      Submit
    </button>
  </div>

  {/* REVIEWS */}
  <div className="bg-gray-50 p-6 rounded-xl">
    <h2 className="text-xl font-bold mb-3">Customer Reviews</h2>

    {product.reviews?.length > 0 ? (
      product.reviews.map((r, i) => (
        <div key={i} className="border-b py-3">
          <p className="font-semibold text-base">{r.name || "Anonymous"}</p>
          <p className="text-yellow-500 text-base">⭐ {r.rating}</p>
          <p className="text-gray-600 text-base">{r.comment}</p>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500">No reviews yet. Be the first to review this product.</p>
    )}
  </div>
</div>
    </div>
  </div>
  );
}
