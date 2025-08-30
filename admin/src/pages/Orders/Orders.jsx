import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/order/orders");
      setOrders(data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // Mark order as Paid
  const markAsPaid = async (orderId) => {
    try {
      await axios.post("http://localhost:4000/api/order/mark-paid", { orderId });
      fetchOrders(); // refresh list
    } catch (err) {
      console.error("Error marking paid:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filter
  const filteredOrders = orders.filter((o) => {
    if (filter === "All") return true;
    return o.status === filter;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Orders</h2>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg shadow ${filter === "All" ? "bg-blue-600 text-white" : "bg-blue-200"}`}
          onClick={() => setFilter("All")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-lg shadow ${filter === "Pending" ? "bg-orange-600 text-white" : "bg-orange-200"}`}
          onClick={() => setFilter("Pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-2 rounded-lg shadow ${filter === "Paid" ? "bg-green-600 text-white" : "bg-green-200"}`}
          onClick={() => setFilter("Paid")}
        >
          Paid
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 shadow-lg rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">QR Code</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o._id} className="border-t hover:bg-gray-100">
                <td className="p-3">{o.orderId}</td>
                <td className="p-3">₹{o.amount}</td>
                <td className="p-3">
                  {o.status === "Paid" ? (
                    <span className="text-green-600 font-bold">✅ Paid</span>
                  ) : (
                    <span className="text-orange-600 font-bold">⏳ Pending</span>
                  )}
                </td>
                <td className="p-3">
                  <img src={o.qrImage} alt="QR" width="80" />
                </td>
                <td className="p-3">
                  {o.status === "Pending" ? (
                    <button
                      onClick={() => markAsPaid(o.orderId)}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Mark Paid
                    </button>
                  ) : (
                    <span className="text-gray-500">✔ Done</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
