import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  upiLink: { type: String, required: true },
  qrImage: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Pending, Paid, Failed
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // 👈 added
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);

