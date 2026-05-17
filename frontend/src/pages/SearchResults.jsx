import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import API from "../services/api";
import Toast from "../components/Toast";

const formatCurrency = (value) =>
  typeof value === "number"
    ? value.toLocaleString("en-IN", { maximumFractionDigits: 0 })
    : value;

const buildQueryParams = (existingSearch, updatedValues) => {
  const params = new URLSearchParams(existingSearch);
  Object.entries(updatedValues).forEach(([key, value]) => {
    if (value || value === 0) {
      params.set(key, String(value));
    } else {
      params.delete(key);
    }
  });
  return params.toString();
};

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateCartCount } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setKeyword(params.get("keyword") || "");
    setCategory(params.get("category") || "");
    setBrand(params.get("brand") || "");
    setMinPrice(params.get("minPrice") || "");
    setMaxPrice(params.get("maxPrice") || "");
    setRating(params.get("rating") || "");

    setLoading(true);
    API.get(`/products${location.search}`)
      .then((res) => {
        setProducts(res.data?.data || []);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [location.search]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))].sort(),
    [products]
  );

  const brands = useMemo(
    () => [...new Set(products.map((product) => product.brand).filter(Boolean))].sort(),
    [products]
  );

  const searchSummary = keyword || category || brand ? (
    <span className="text-orange-600">{keyword || category || brand}</span>
  ) : (
    <span className="text-orange-600">all products</span>
  );

  const updateFilters = (updates) => {
    const queryString = buildQueryParams(location.search, updates);
    navigate(queryString ? `/search?${queryString}` : "/search");
  };

  const handleSearch = () => {
    updateFilters({ keyword, category, brand, minPrice, maxPrice, rating });
  };

  const handleClearFilters = () => {
    navigate("/search");
  };

  const showToast = (message, type = "success") => {
    setToast({ open: true, message, type });
  };

  const handleCloseToast = () => {
    setToast((current) => ({ ...current, open: false }));
  };

  const addToCart = async (event, product) => {
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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Toast open={toast.open} type={toast.type} message={toast.message} onClose={handleCloseToast} />

      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 mb-2">Search results for {searchSummary}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {loading ? "Loading results..." : `${products.length} products found`}
            </h1>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Refine search</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. protein, mass gainer"
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="">All Brands</option>
                  {brands.map((brandItem) => (
                    <option key={brandItem} value={brandItem}>
                      {brandItem}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="₹0"
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="₹9999"
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="">Any rating</option>
                  <option value="4">4 stars & up</option>
                  <option value="3">3 stars & up</option>
                  <option value="2">2 stars & up</option>
                  <option value="1">1 star & up</option>
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="w-full rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600"
              >
                Apply filters
              </button>
            </div>
          </aside>

          <section>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="animate-pulse rounded-3xl bg-gray-100 p-4 h-80" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-6xl">🔍</p>
                  <h2 className="mt-6 text-2xl font-semibold text-gray-900">No products matched</h2>
                  <p className="mt-2 text-sm text-gray-500">Try different keywords, categories, or loosen filters.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-xl"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      <div className="relative overflow-hidden bg-gray-100">
                        <img
                          src={`https://gymkart-2.onrender.com/images/${product.image}`}
                          alt={product.name}
                          className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x320?text=No+Image';
                            e.target.onerror = null;
                          }}
                        />
                        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow">
                          {product.category}
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{product.brand}</p>
                        <h3 className="mt-3 text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                          <span>{product.rating?.toFixed(1) || '0.0'} ★</span>
                          <span>•</span>
                          <span>{product.numReviews || 0} reviews</span>
                        </div>
                       
                          <div>
                            <p className="text-2xl font-bold m-3 text-gray-900">₹{formatCurrency(product.price)}</p>
                          </div>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              addToCart(event, product);
                            }}
                            className="rounded-2xl flex items-center justify-center bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                          >
                            Add to cart
                          </button>
                        
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
