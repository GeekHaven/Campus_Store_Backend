const Product = require("../models/products.js");
const User = require("../models/users.js");
const Order = require("../models/orders.js");

const getProductId = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).end();
  res.json(product);
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: "desc" }).exec();
  res.json(products);
};

const updateProduct = async (req, res) => {
  const { token, body: productChanges } = req;
  const product = await Product.findById(req.params.id);
  const user = await User.findById(token.id);

  if (!user || !token) return res.status(401).json({ error: "Unauthorized" });
  if (!product) return res.status(404);
  if (!product.sellerid.equals(user._id))
    return res.status(401).json({ error: "Unauthorized" });

  const updated = await Product.findByIdAndUpdate(product._id, productChanges);
  console.log("The updated val is ", updated);
  res.status(200).json(updated);
};

const deleteProduct = async (req, res) => {
  const { token } = req;
  const product = await Product.findById(req.params.id);
  const user = await User.findById(token.id);
  if (!user || !token) return res.status(401).json({ error: "Unauthorized" });
  if (!product) return res.status(404);

  if (!product.sellerid.equals(user._id))
    return res.status(401).json({ error: "Unauthorized" });

  await Product.findByIdAndRemove(product._id);

  res.status(204).end();
};

const placeOrder = async (req, res) => {
  const { token } = req;
  const product = await Product.findById(req.params.id);
  const user = await User.findById(token.id);
  if (!user || !token) return res.status(401).json({ error: "Unauthorized" });
  if (!product) return res.status(404);
  const newOrder = new Order({
    sellerid: product.sellerid,
    userid: user._id,
    product: product._id,
  });
  const response = await newOrder.save();
  user.orders.push(response._id);
  await user.save();
  res.status(201).json(response);
};

const createProduct = async (req, res) => {
  const { token, body: product } = req;
  const user = await User.findById(token.id);
  if (!user || !user.isSeller)
    return res.status(401).json({ error: "Unauthorized" });

  if (!product)
    return res.status(400).json({ error: "Please enter all the details" });
  const saveProduct = new Product({
    ...product,
    sellerid: user._id,
  });
  const response = await saveProduct.save();
  res.status(201).json(response);
};

module.exports = {
  placeOrder,
  getProductId,
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
};
