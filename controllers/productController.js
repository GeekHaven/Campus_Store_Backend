const Product = require("../models/products");
const User = require("../models/users");
const Order = require("../models/orders");
const Seller = require("../models/sellers");

// Getting a specific product
const getProductId = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("seller","username").exec();
  if (!product) return res.status(404).end();
  res.json(product);
};

// Getting the list of all the products
const getAllProducts = async (req, res) => {
  const products = await Product.find({}).sort({ createdAt: "desc" }).exec();
  res.json(products);
};

// Update a product,(given that the user sending the request is the product's seller)
const updateProduct = async (req, res) => {
  const { token, body: productChanges } = req;
  const product = await Product.findById(req.params.id);
  const seller = await Seller.findById(token.id);

  if (!seller || !token) return res.status(401).json({ error: "Unauthorized" });
  if (!product) return res.status(404);
  if (!product.seller.equals(seller._id))
    return res.status(401).json({ error: "Unauthorized" });

  const updated = await Product.findByIdAndUpdate(product._id, productChanges);
  res.status(200).json(updated);
};

// Delete a product, (given that the user sending the request is the product's seller)
const deleteProduct = async (req, res) => {
  const { token } = req;
  const product = await Product.findById(req.params.id);
  const seller = await Seller.findById(token.id);
  if (!seller || !token) return res.status(401).json({ error: "Unauthorized" });
  if (!product) return res.status(404);

  if (!product.seller.equals(seller._id))
    return res.status(401).json({ error: "Unauthorized" });

  await Product.findByIdAndRemove(product._id);
  res.status(204).end();
};

// Place order for a product, given that the buyer is signed in
const placeOrder = async (req, res) => {
  const {
    token,
    body: { quantity },
  } = req;
  const product = await Product.findById(req.params.id);
  const user = await User.findById(token.id);
  if (!user || !token) return res.status(401).json({ error: "Unauthorized" });
  if (!product) return res.status(404);
  if (product.stock < quantity)
    return res.status(400).json({ error: "Quantity not available" });

  console.log(user);
  console.log(product);
  const newOrder = await new Order({
    seller: product.seller,
    user: user._id,
    product: product._id,
    quantity,
  }).save();

  console.log(newOrder);

  const seller = await Seller.findById(product.seller);
  console.log(seller);
  user.orders.push(newOrder._id);
  seller.orders.push(newOrder._id);
  await user.save();
  await seller.save();

  const response = await Order.findById(newOrder._id)
    .populate("seller")
    .populate("user")
    .populate("product")
    .exec();
  res.status(201).json(response);
};

// Create a new product, given that the user is a registered as a seller
const createProduct = async (req, res) => {
  const { token, body: product } = req;
  const seller = await Seller.findById(token.id);
  if (!seller) return res.status(401).json({ error: "Unauthorized" });

  if (Object.keys(product).length == 0)
    return res.status(400).json({ error: "Please enter all the details" });
  const saveProduct = new Product({
    ...product,
    seller: seller._id,
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
