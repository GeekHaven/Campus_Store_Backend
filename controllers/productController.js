import jwt from "jsonwebtoken";
import Product from "../models/products.js";
import User from "../models/users.js";
import Order from "../models/orders.js";

const getProductId = async (req, res) => {
  console.log(`Product ${req.params.id}`);
  const product = await Product.findById(req.params.id);
  res.status(200).json(product);
};

const placeOrder = async (req, res) => {
  console.log(`Product ${req.params.id}`);
  const token = req.token;
  const product = await Product.findById(req.params.id);
  const user = await User.findById(token.id);
  if (!user || !token) return res.status(401).json({ error: "Unauthorized" });
  const newOrder = new Order({
    sellerid: product.sellerid,
    userid: user._id,
    product: product._id,
  });
  const response = await newOrder.save();
  res.json(response);
};

const createProduct = async (req, res) => {
  const token = req.token;
  const product = req.body;
  const user = await User.findById(token.id);
  if (!user || !token) return res.status(401).json({ error: "Unauthorized" });
  if (!user.isSeller) return res.status(401).json({ error: "Unauthorized" });
  const saveProduct = new Product({
    ...product,
    sellerid: user._id,
  });
  const response = await saveProduct.save();
  res.json(response);
};

export { placeOrder, getProductId, createProduct };
