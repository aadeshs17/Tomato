import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function UserOrder() {
  const { orderId } = useParams(); // get dynamic id from URL
  const [order, setOrder] = useState(null);
  const [polling, setPolling] = useState(true);
  const imgRef = useRef(null);

  const API = "http://localhost:4000/api/order";

  // fetch order on mount
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${API}/order/${orderId}`);
        if (data.success) {
          setOrder(data.order);
          if (data.order.status === "Paid") {
            setPolling(false);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Poll order status every 5s
  useEffect(() => {
    if (!polling) return;
    const t = setInterval(async () => {
      try {
        const { data } = await axios.get(`${API}/order/${orderId}`);
        if (data.success) {
          setOrder(data.order);
          if (data.order.status === "Paid") {
            setPolling(false);
          }
        }
      } catch (e) {
        console.error("poll error", e);
      }
    }, 5000);
    return () => clearInterval(t);
  }, [polling, orderId]);

  const copyLink = async () => {
    if (order?.upiLink) {
      await navigator.clipboard.writeText(order.upiLink);
      alert("Payment link copied!");
    }
  };

  const downloadQR = () => {
    if (!imgRef.current) return;
    const a = document.createElement("a");
    a.href = imgRef.current.src;
    a.download = `${orderId}_qr.png`;
    a.click();
  };

  if (!order) return <div className="p-6">Loading order...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Pay for Your Order</h1>

      {/* Order info */}
      <div className="border rounded p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Order ID</div>
            <div className="font-mono">{order.orderId}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Amount</div>
            <div className="font-semibold">₹{order.amount}</div>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-2">Scan to Pay</div>
          <img
            ref={imgRef}
            src={order.qrImage}
            alt="UPI QR"
            className="w-48 h-48 border rounded mx-auto"
          />
        </div>

        <div className="space-y-2">
          <div className="text-sm text-gray-600">Or tap the link:</div>
          <a className="text-blue-600 underline break-all" href={order.upiLink}>
            {order.upiLink}
          </a>
        </div>

        <div className="flex gap-3">
          <button
            onClick={copyLink}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Copy Link
          </button>
          <button
            onClick={downloadQR}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download QR
          </button>
        </div>

        <div className="text-sm">
          <span className="font-semibold">Status: </span>
          {order.status === "Paid" ? (
            <span className="text-green-700 font-semibold">Paid ✅</span>
          ) : (
            <span className="text-orange-700 font-semibold">Pending ⏳</span>
          )}
        </div>
      </div>
    </div>
  );
}
