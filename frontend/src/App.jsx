import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Navbar from "./components/organisms/Navbar";
import Footer from "./components/organisms/Footer";
import ProductDetails from "./pages/ProductDetails";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import { CartProvider } from "./context/CartContext";

function App() {
  const storedData = JSON.parse(localStorage.getItem("user"));
  const user = storedData?.user || storedData;
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="bg-gray-100 min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/orders" element={<Orders />} />
              <Route
                path="/admin"
                element={
                  user?.role === "admin" ? (
                    <AdminDashboard />
                  ) : (
                    <h1 className="p-6 text-red-500"> Access Denied </h1>
                  )
                }
              />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;