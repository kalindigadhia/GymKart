import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Toast from "../components/Toast";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });
  const navigate = useNavigate();
  const { updateCartCount } = useCart();

  const showToast = (message, type = "success") => {
    setToast({ open: true, message, type });
  };

  const handleCloseToast = () => {
    setToast((current) => ({ ...current, open: false }));
  };

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data.data);
    } catch (error) {
      showToast(error?.response?.data?.message || "Unable to fetch cart", "error");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ❌ REMOVE ITEM
  const removeItem = async (id) => {
    try {
      await API.delete(`/cart/${id}`);
      await fetchCart();
      updateCartCount();
      showToast("Item removed from cart", "success");
    } catch (error) {
      showToast(error?.response?.data?.message || "Failed to remove item", "error");
    }
  };

  // ➕➖ UPDATE QTY WITH STOCK CHECK
  const updateQty = async (productId, newQty, maxStock) => {
    if (newQty < 1) {
      showToast("Quantity must be at least 1", "error");
      return;
    }
    if (newQty > maxStock) {
      showToast(`Only ${maxStock} item${maxStock === 1 ? "" : "s"} available in stock`, "error");
      return;
    }
    console.log("Updating:", productId, newQty);

    // try {
    //   await API.put(`/cart/${productId}`, { qty: newQty });
    //   await fetchCart();
    //   updateCartCount();
    //   showToast("Cart updated", "success");
    // } catch (error) {
    //   showToast(error?.response?.data?.message || "Failed to update quantity", "error");
    // }
    try {
    const res = await API.put(`/cart/${productId}`, {
      qty: newQty,
    });

    console.log(res.data);

    await fetchCart();
    updateCartCount();
  } catch (error) {
    console.log(error.response?.data);
  }
  };

  // 💰 TOTAL
  const totalPrice =
    cart?.cartItems?.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    ) || 0;

  // 💳 CHECKOUT (Stripe page par ja)
  const checkout = () => {
    navigate("/checkout", { state: { total: totalPrice } });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toast open={toast.open} type={toast.type} message={toast.message} onClose={handleCloseToast} />
      <h1 className="text-2xl font-bold mb-6">Your Cart 🛒</h1>

      {cart?.cartItems?.length === 0 && (
        <p>Your cart is empty</p>
      )}

      {cart?.cartItems?.map((item) => {
        const productId = item.product?._id || item.product;
       const maxStock = item.countInStock || 100;
        const isOutOfStock = item.countInStock === 0;

        return (
          <div
            key={productId}
            className={`flex items-center border p-4 rounded mb-3 shadow-sm ${
              isOutOfStock ? "bg-gray-50 opacity-75" : "bg-white"
            }`}
          >
            {/* Image */}
            <img
              src={`https://gymkart-2.onrender.com/images/${item.image}`}
              alt={item.name}
              className="w-20 h-20 object-contain mr-4"
            />

            {/* LEFT */}
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p className="text-gray-600">₹{item.price?.toLocaleString('en-IN')}</p>

              {/* Stock Badge */}
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  isOutOfStock
                    ? "bg-rose-100 text-rose-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {isOutOfStock ? "Out of Stock" : `${maxStock} in stock`}
              </span>

              {/* QTY */}
              {!isOutOfStock && (
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => updateQty(productId, item.qty - 1, maxStock)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 bg-gray-100 rounded font-semibold">{item.qty}</span>
                  <button
                    onClick={() => updateQty(productId, item.qty + 1, maxStock)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="text-right ml-4">
              <p className="font-bold text-lg">₹{(item.price * item.qty)?.toLocaleString('en-IN')}</p>
              <button
                onClick={() => removeItem(productId)}
                className="text-red-500 text-sm mt-2 hover:text-red-700 transition"
              >
                Remove ❌
              </button>
            </div>
          </div>
        );
      })}

      {/* TOTAL */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-xl font-bold">Total: ₹{totalPrice?.toLocaleString('en-IN')}</h2>
        <button
          onClick={checkout}
          disabled={cart?.cartItems?.length === 0}
          className={`w-full py-3 mt-4 rounded-lg font-semibold transition ${
            cart?.cartItems?.length === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Checkout 💳
        </button>
      </div>
    </div>
  );
}