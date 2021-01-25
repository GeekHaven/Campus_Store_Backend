import express from "express";
import { getAllOrders, getOrder } from "../controllers/orderController.js";
import getToken from "../middleware/getToken.js";

const router = express.Router();
router.route("/").get(getToken, getAllOrders);
router.route("/:id").get(getToken, getOrder);

export default router;

// /:id shows the information about the order asks user to confirm the order and tells them to make the payment.
