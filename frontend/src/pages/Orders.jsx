import { useEffect, useState } from "react";
import API from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders/myorders").then((res) => {
      setOrders(res.data.data);
    });
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders 📦</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border p-4 rounded mb-4"
        >
          <h2 className="font-semibold">
            Order ID: {order._id}
          </h2>

          <p>Total: ₹{order.totalPrice}</p>

          <p>
            Status:
            <span className="ml-2 font-semibold">
              {order.isDelivered
                ? "Delivered ✅"
                : order.isPaid
                ? "Paid 💳"
                : "Pending ⏳"}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}