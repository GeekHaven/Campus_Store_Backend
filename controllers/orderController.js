const Order = require("../models/orders.js");
const User = require("../models/users.js");
const getToken = require("../middleware/getToken");

const getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({ userid: req.token.id })
    .sort({ createdAt: "desc" })
    .exec();
  res.json(orders);
};

module.exports = { getOrder, getAllOrders };
