const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Seller = require("../models/sellers");
const User = require("../models/users");
const Order = require("../models/orders");
const Product = require("../models/products");

const loginSeller = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  //checking for required data
  if (!email || !password)
    return res.status(400).json({ error: "Please enter all the details" });

  //checking if the seller exists or not
  const seller = await Seller.findOne({ email });
  if (!seller)
    return res
      .status(401)
      .json({ error: "Email does not exist. Please register first." });

  // checking the password
  const authenticated = await bcrypt.compare(password, seller.passwordHash);
  if (!authenticated)
    return res.status(401).json({ error: "Invalid credentials" });

  // the data that is stored in the encrypted token
  const tokenUser = {
    email: seller.email,
    id: seller._id,
    username: seller.username,
    type: "seller",
  };

  const token = jwt.sign(tokenUser, process.env.SECRET, { expiresIn: "5d" });
  res.json({ token, tokenUser });
};

const registerSeller = async (req, res) => {
  const { token } = req;
  console.log(req.body);
  const { email, password, ...restBody } = req.body;
  const user = await User.findById(token.id);
  // user who isn't an admin cannot add a new seller
  if (!user.isAdmin)
    return res
      .status(401)
      .json({ error: "Unauthorized to perform the required action" });

  //checking for required data
  if (!email || !password)
    return res
      .status(400)
      .json({ error: "Email and password are required fields" });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const seller = new Seller({
    email,
    passwordHash,
    ...restBody,
  });

  await seller.save();
  res.status(201).end();
};

const getSellerData = async (req, res) => {
  const token = req.token;
  const seller = await Seller.findById(token.id)
    .populate({
      path: "orders",
      populate: { path: "user" },
      populate: { path: "product" },
    })
    .exec();
  console.log(seller);
  if (token.type !== "seller" || !seller) return res.status(404).end();
  res.status(200).json(seller);
};

const getOrderById = async (req, res) => {
  const order = await checkSeller(req.token, req.params.id);
  if (!order) return res.status(404).end();
  res.status(200).json(order);
};

const modifyOrderStatus = async (req, res) => {
  const { token } = req;
  if (token.type !== "seller") return res.status(404).end();

  const orderId = req.params.id;
  let order = await Order.findById(orderId);

  if (!order || !order.seller._id.equals(token.id))
    return res.status(404).end();

  const product = await Product.findById(order.product);
  if (order.confirmed === false && req.body.confirmed === true) {
    if (order.quantity > product.stock)
      return res.status(400).json({ error: "Quantity not available" });
    product.stock -= order.quantity;
    await product.save();
  }

  const modifiedOrder = await Order.findByIdAndUpdate(orderId, req.body, {
    new: true,
  });
  console.log("The req.body is", req.body);
  console.log("The order is", order);
  console.log("The modified order is", modifiedOrder);
  res.status(200).json(modifiedOrder);
};

async function checkSeller(token, orderId) {
  if (token.type !== "seller") return false;
  const order = await Order.findById(orderId).populate("seller").exec();
  if (!order || !order.seller._id.equals(token.id)) return false;
  return order;
}
module.exports = {
  getSellerData,
  loginSeller,
  registerSeller,
  getOrderById,
  modifyOrderStatus,
};
