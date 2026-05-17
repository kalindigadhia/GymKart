import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const total = location.state?.total || 0;

  const handlePayment = async () => {
    try {
      // 1️⃣ Create order from backend
      const { data } = await API.post("/payment/razorpay", {
        amount: total,
      });

      const options = {
        key: "rzp_test_Sea2dek97Di1Kr", 
        amount: data.amount,
        currency: "INR",
        name: "GymKart",
        description: "Order Payment",
        order_id: data.id,

        handler: async function (response) {
          alert("Payment Successful 🎉");

          // 🔥 Order create karo
          await API.post("/orders/checkout");

          navigate("/orders");
        },

        theme: {
          color: "#f97316",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log(err);
      alert("Payment Failed ❌");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <button
        onClick={handlePayment}
        className="w-full bg-orange-500 text-white py-3 rounded-lg"
      >
        Pay ₹{total}
      </button>
    </div>
  );
}