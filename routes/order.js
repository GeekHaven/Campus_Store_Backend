const express = require("express");
const { getAllOrders, getOrder } = require("../controllers/orderController.js");
const getToken = require("../middleware/getToken.js");

const router = express.Router();
router.route("/").get(getToken, getAllOrders);
router.route("/:id").get(getToken, getOrder);

module.exports = router;

// /:id shows the information about the order asks user to confirm the order and tells them to make the payment.
