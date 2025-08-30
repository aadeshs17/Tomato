import express from "express";
import { generateQR, markAsPaid, getOrders,getOrderById,userOrders } from "../controllers/orderController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/generate-qr", generateQR);
router.post("/mark-paid", markAsPaid);
router.get("/orders", getOrders);
router.get("/order/:orderId", getOrderById);
router.post("/userorders", authMiddleware,userOrders);

export default router;
