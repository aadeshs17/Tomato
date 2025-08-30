import QRCode from "qrcode";
import Order from "../models/orderModel.js";

// Generate QR and save order
export const generateQR = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ success: false, message: "Amount and orderId required" });
    }

    const upiId = "aadeshsrivastava69@oksbi";  
    const payeeName = "FoodDelivery";  

    const upiLink = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount}&cu=INR&tn=Order-${orderId}`;
    const qrImage = await QRCode.toDataURL(upiLink);

    const newOrder = new Order({
      orderId,
      amount,
      upiLink,
      qrImage,
      status: "Pending",
      userId: req.body.userId   // 👈 attach from authMiddleware
    });

    await newOrder.save();

    res.json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Mark order as Paid (manual confirmation / admin)
export const markAsPaid = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = "Paid";
    await order.save();

    res.json({ success: true, message: "Order marked as Paid", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all orders (admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get orders for logged-in user
export const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user?.id });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching user orders" });
  }
};
