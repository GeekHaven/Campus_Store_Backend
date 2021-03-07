const Order = require("../models/orders.js");
const User = require("../models/users.js");

const getOrder = async (req, res) => {
  checkToken(req, res);
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.status(200).json(order);
};

const getAllOrders = async (req, res) => {
  checkToken(req, res); //TODO: Check this thing for errors once.
  const order = await Order.find({}).sort({ createdAt: "desc" }).exec();
  res.json(order);
};

const checkToken = async (req, res) => {
  const token = req.token;

  const user = await User.findById(token.id);
  if (!user || !token) return res.status(401).json({ error: "Unauthorized" });
};

module.exports = { getOrder, getAllOrders };
