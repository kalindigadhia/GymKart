import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Toast from "../components/Toast";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });
  const navigate = useNavigate();
  const location = useLocation();
  const { updateCartCount } = useCart();

  const showToast = (message, type = "success") => {
    setToast({ open: true, message, type });
  };

  const handleCloseToast = () => {
    setToast((current) => ({ ...current, open: false }));
  };

  const handleAddToCart = async (event, product) => {
    event.stopPropagation();
    if (product.countInStock === 0) {
      showToast("This product is out of stock", "error");
      return;
    }

    try {
      await API.post("/cart", { productId: product._id, qty: 1 });
      updateCartCount();
      showToast("Added to cart ✅", "success");
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Unable to add item to cart",
        "error"
      );
    }
  };

useEffect(() => {
  setLoading(true);

  API.get(`/products${location.search}`)
    .then((res) => {
      setProducts(res.data?.data || []);
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching products:', error);
      setProducts([]);
      setLoading(false);
    });
}, [location.search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast open={toast.open} type={toast.type} message={toast.message} onClose={handleCloseToast} />
      {/* Hero Section */}
<div className="relative text-white overflow-hidden">
  
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: "url('/gym1.png')" }}
  ></div>

  {/* Dark + Gradient Overlay (better visibility) */}
  <div className="absolute inset-0 bg-white/40"></div>

  {/* Content */}
  <div className="relative flex items-center justify-center text-center min-h-[70vh] px-4">
    
    <div className="max-w-2xl animate-fadeInUp">
      
      <h1 className="text-gray-700 text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
        Build Your{" "}
        <span className="text-orange-400">
          Dream Body
        </span>
      </h1>

      <p className="text-lg sm:text-xl mb-8 text-gray-500">
        Premium gym equipment and supplements for fitness enthusiasts.
        Transform your workout with our quality products.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        
        <button
          onClick={() => navigate('/?category=proteinSupplement')}
          className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition duration-300"
        >
          Shop Protein
        </button>

        <button
          onClick={() => navigate('/?category=Equipment')}
          className="text-gray-700 border border-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 hover:text-gray-300 transition duration-300"
        >
          View Equipment
        </button>

      </div>
    </div>

  </div>
</div>

    {/* Categories Section */}
<div className="py-12 lg:py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-700">
      Shop by Category
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

      {/* Protein Category */}
      <div
        onClick={() => navigate('/?category=proteinSupplement')}
        className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition duration-500"
          style={{ backgroundImage: "url('/protein.jpg')" }}
        ></div>

        {/* Light Overlay */}
        <div className="absolute inset-0 bg-white/30 group-hover:bg-white/20 transition"></div>

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center h-full text-center px-4 text-gray-900">
          <h3 className="text-2xl font-bold mb-2 drop-shadow">
            Protein Supplements
          </h3>
          <p className="text-sm">
            Whey, creatine & more
          </p>
        </div>
      </div>

      {/* Equipment Category */}
      <div
        onClick={() => navigate('/?category=Equipment')}
        className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
      >
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition duration-500"
          style={{ backgroundImage: "url('/gymequipments.jpg')" }}
        ></div>

        <div className="absolute inset-0 bg-white/30 group-hover:bg-white/20 transition"></div>

        <div className="relative flex flex-col items-center justify-center h-full text-center px-4 text-gray-900">
          <h3 className="text-2xl font-bold mb-2 drop-shadow">
            Gym Equipment
          </h3>
          <p className="text-sm">
            Dumbbells, machines & more
          </p>
        </div>
      </div>

      {/* Accessories Category */}
      <div
        onClick={() => navigate('/?category=Accessories')}
        className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
      >
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition duration-500"
          style={{ backgroundImage: "url('/accessories.jpg')" }}
        ></div>

        <div className="absolute inset-0 bg-white/30 group-hover:bg-white/20 transition"></div>

        <div className="relative flex flex-col items-center justify-center h-full text-center px-4 text-gray-900">
          <h3 className="text-2xl font-bold mb-2 drop-shadow">
            Accessories
          </h3>
          <p className="text-sm">
            Bottles, straps & gear
          </p>
        </div>
      </div>

    </div>
  </div>
</div>

      {/* Featured Products Section */}
      <div className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4 sm:mb-0">Featured Products</h2>
            <button
              onClick={() => navigate('/')}
              className="text-orange-500 hover:text-orange-600 font-semibold text-sm sm:text-base"
            >
              View All →
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded mb-2"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            ) : products.length === 0 ? (
              // Empty state
              <div className="col-span-full text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse our categories.</p>
                <button
                  onClick={() => navigate('/')}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition duration-300"
                >
                  View All Products
                </button>
              </div>
            ) : (
              products.slice(0, 10).map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group"
                >
                {/* Product Image */}
                <div
                  className="relative overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${p._id}`)}
                >
                  <img
                    src={`http://localhost:5043/images/${p.image}`}
                    alt={p.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      e.target.onerror = null; // Prevent infinite loop
                    }}
                  />
                  {/* Wishlist icon */}
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition duration-300">
                    <span className="text-gray-400 text-xl">♡</span>
                  </div>
                  {/* Stock badge */}
                  {p.countInStock > 0 ? (
                    <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      In stock
                    </div>
                  ) : (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded mr-2">
                      {(p.rating || 0).toFixed(1)} ★
                    </span>
                    <span className="text-gray-500 text-sm">({p.numReviews || 0} reviews)</span>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-semibold mb-1 hover:text-orange-500 cursor-pointer overflow-hidden"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                      onClick={() => navigate(`/product/${p._id}`)}>
                    {p.name}
                  </h3>

                  {/* Brand */}
                  <p className="text-gray-500 text-sm mb-2">{p.brand}</p>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-2xl font-bold text-gray-800">₹{p.price?.toLocaleString('en-IN')}</p>
                    {p.discountPrice ? (
                      <p className="text-sm text-gray-500 line-through">₹{p.discountPrice?.toLocaleString('en-IN')}</p>
                    ) : null}
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2">
                    <button
                      className={`w-full py-2 rounded-lg font-medium transition duration-300 ${
                        p.countInStock === 0
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-orange-500 text-white hover:bg-orange-600"
                      }`}
                      onClick={(e) => handleAddToCart(e, p)}
                      disabled={p.countInStock === 0}
                    >
                      {p.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
                    </button>

                    <button
                      className="w-full border border-orange-500 text-orange-500 py-2 rounded-lg hover:bg-orange-50 transition duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${p._id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 lg:mb-12 text-gray-700">Why Choose GymKart?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="text-center p-4 sm:p-6">
              <div className="text-4xl sm:text-6xl mb-4">✅</div>
              <h3 className="text-gray-700 text-lg sm:text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm sm:text-base">Only the best products from trusted brands.</p>
            </div>
            <div className="text-center p-4 sm:p-6">
              <div className="text-4xl sm:text-6xl mb-4">🚚</div>
              <h3 className="text-gray-700 text-lg sm:text-xl font-semibold mb-2">Fast Shipping</h3>
              <p className="text-gray-600 text-sm sm:text-base">Get your fitness gear delivered quickly and reliably.</p>
            </div>
            <div className="text-center p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="text-4xl sm:text-6xl mb-4">💬</div>
              <h3 className="text-gray-700 text-lg sm:text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm sm:text-base">Our dedicated support team is always here to help you.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 lg:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
            <div className="p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">1000+</div>
              <div className="text-gray-600 text-sm sm:text-base">Happy Customers</div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">500+</div>
              <div className="text-gray-600 text-sm sm:text-base">Products</div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">50+</div>
              <div className="text-gray-600 text-sm sm:text-base">Brands</div>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">24/7</div>
              <div className="text-gray-600 text-sm sm:text-base">Support</div>
            </div>
          </div>
        </div>
      </div>

      </div>
  );
}