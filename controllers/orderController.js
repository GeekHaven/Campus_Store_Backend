const Order = require("../models/orders.js");
const getToken = require("../middleware/getToken");
const User = require("../models/users.js");

// Get a particular order for the logged in user.
const getOrder = async (req, res) => {
  const { token } = req;
  const user = await User.findById(token.id);
  const order = await Order.findById(req.params.id)
    .populate("seller")
    .populate("user")
    .populate("product")
    .exec();

  if (!user) return res.status(400).json({ error: "Invalid credentials" });
  if (user._id.toString() !== order.user._id.toString()) {
    return res.status(404).end();
  }

  if (!order) return res.status(404).end();
  res.status(200).json(order);
};

//Get all the orders placed by the user.
const getAllOrders = async (req, res) => {
  const orders = await Order.find({ user: req.token.id })
    .sort({ createdAt: "desc" })
    .exec();
  res.json(orders);
};

module.exports = { getOrder, getAllOrders };
