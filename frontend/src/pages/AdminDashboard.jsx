import React from "react";
import { useEffect, useState } from "react";
import API from "../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";


export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
const [recentOrders, setRecentOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Product form states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    countInStock: '',
    image: ''
  });

  useEffect(() => {
    API.get("/dashboard").then((res) => {
      setStats(res.data.data);
    });
    API.get("/dashboard/revenue").then((res) => {
      setChartData(res.data.data);
    });
     API.get("/dashboard/top-products").then((res) => {
    setTopProducts(res.data.data);
  });

  API.get("/dashboard/recent-orders").then((res) => {
    setRecentOrders(res.data.data);
  });

  // Fetch all products
  API.get("/products").then((res) => {
    setAllProducts(res.data.data);
  });
  }, []);

  // Handle product form submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/products', productForm);
      alert('Product added successfully!');
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        countInStock: '',
        image: ''
      });
      setShowAddProduct(false);
      // Refresh products list
      API.get("/products").then((res) => {
        setAllProducts(res.data.data);
      });
    } catch (error) {
      alert('Error adding product: ' + error.response?.data?.message || error.message);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value
    });
  };

  if (!stats) return <h1>Loading...</h1>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard 📊
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Total Orders</h2>
          <p className="text-2xl font-bold">
            {stats.totalOrders}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Total Revenue</h2>
          <p className="text-2xl font-bold text-green-600">
            ₹{stats.totalRevenue}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Total Users</h2>
          <p className="text-2xl font-bold">
            {stats.totalUsers}
          </p>
        </div>

      </div>

      {/* Add Product Section */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Product 🛍️</h2>
          <button
            onClick={() => setShowAddProduct(!showAddProduct)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          >
            {showAddProduct ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {showAddProduct && (
          <form onSubmit={handleProductSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={productForm.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={productForm.category}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option value="Protein">Protein</option>
                <option value="Equipment">Equipment</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={productForm.brand}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter brand name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                name="price"
                value={productForm.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count *</label>
              <input
                type="number"
                name="countInStock"
                value={productForm.countInStock}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter stock quantity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                name="image"
                value={productForm.image}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter image filename (e.g., whey.png)"
              />
              <p className="text-xs text-gray-500 mt-1">Upload image to backend/public/images/ folder first</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={productForm.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter product description"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 font-medium"
              >
                Add Product
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Products List */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">All Products 📦</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Image</th>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Category</th>
                <th className="text-left py-2">Brand</th>
                <th className="text-left py-2">Price</th>
                <th className="text-left py-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="py-2">
                    <img
                      src={`http://localhost:5043/images/${product.image}`}
                      alt={product.name}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                      }}
                    />
                  </td>
                  <td className="py-2 font-medium">{product.name}</td>
                  <td className="py-2">{product.category}</td>
                  <td className="py-2">{product.brand || '-'}</td>
                  <td className="py-2 font-bold">₹{product.price}</td>
                  <td className="py-2">{product.countInStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow">
  <h2 className="text-xl font-bold mb-4">
    Monthly Revenue 📈
  </h2>

  <LineChart width={600} height={300} data={chartData}>
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip />
    <CartesianGrid strokeDasharray="3 3" />
    <Line type="monotone" dataKey="revenue" />
  </LineChart>
</div>

<div className="mt-10 bg-white p-6 rounded-xl shadow">
  <h2 className="text-xl font-bold mb-4">
    Top Selling Products 🏆
  </h2>

  {topProducts.map((p, i) => (
    <div key={i} className="flex justify-between border-b py-2">
      <span>{p.name}</span>
      <span className="font-bold">{p.totalSold}</span>
    </div>
  ))}
</div>
 
 <div className="mt-10 bg-white p-6 rounded-xl shadow">
  <h2 className="text-xl font-bold mb-4">
    Recent Orders 📦
  </h2>

  {recentOrders.map((order) => (
    <div key={order._id} className="border-b py-2">
      <p className="text-sm">
        Order: {order._id}
      </p>
      <p className="text-gray-500">
        ₹{order.totalPrice}
      </p>
    </div>
  ))}
</div>

    </div>
  );
}