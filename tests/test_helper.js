const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users.js");
const Order = require("../models/orders");
const Product = require("../models/products");
const app = require("../app");
const Seller = require("../models/sellers.js");

const initialUsers = [
  //*users with complete details
  {
    username: "sarthak",
    email: "sarthak@gmail.com",
    password: "sarthak",
  },
  {
    username: "hacker",
    password: "linuxisbest",
    email: "linuxuser@gmail.com",
  },
  //* users with incomplete details
  {
    username: "hacker",
    email: "linuxuser@gmail.com",
  },
  {
    username: "hacker",
    password: "linuxuser@gmail.com",
  },
  //* user with improper password
  {
    username: "hacker",
    password: "short",
    email: "linuxuser@gmail.com",
  },
];

const initialSellers = [
  {
    username: "Aparkosha",
    email: "aparoksha@iiita.ac.in",
    password: "festofthenorth",
  },
  {
    username: "Effervescence",
    email: "effe@iiita.ac.in",
    password: "effekaisahoga",
  },
];

const initialProducts = [
  //* Complete products
  {
    name: "Aparoksha black tee",
    description: "A black t-shirt from Aparoksha",
    image: "foto.com",
    stock: 100,
    price: 400,
  },
  {
    name: "Effe blue hoodie",
    image: "foto2.com",
    stock: 200,
    price: 500,
  },
  //* Products with incomplete details
  {
    name: "Effe black hoodie",
    stock: 200,
    price: 500,
  },
  {
    name: "Effe black tee",
    image: "foto2.com",
    price: 500,
  },
  {
    name: "Effe blue tee",
    image: "foto2.com",
    stock: 200,
  },
];

//* Functions to help reduce unneccesary code in the tests
//* Signs up a user and adds them to the database
const addUser = async ({ password, ...restData }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    passwordHash,
    ...restData,
  });
  return await user.save();
};

//* Signs up and logs the user in, and returns jwt and the user's details
const loginUser = async (user) => {
  const { email, _id: id } = await addUser(user);
  const tokenUser = {
    email,
    id,
  };
  const token = jwt.sign(tokenUser, process.env.SECRET);
  return {
    token,
    tokenUser,
  };
};

//* Signs up and logs in a seller
const loginSeller = async ({ password, ...restData }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const seller = await new Seller({
    passwordHash,
    ...restData,
  }).save();

  const { email, _id: id } = seller;
  const tokenSeller = { email, id, type: "seller" };
  const token = jwt.sign(tokenSeller, process.env.SECRET);
  return {
    token,
    tokenSeller,
  };
};

//* directly adds a product to the database
const addProduct = async (seller, product) => {
  const newProduct = new Product({
    ...product,
    seller,
  });
  return await newProduct.save();
};

//* directly creates an order for a product
const createOrder = async (userid, product) => {
  const order = new Order({
    seller: product.seller,
    user: userid,
    product: product.id,
  });
  return await order.save();
};

module.exports = {
  initialProducts,
  initialUsers,
  initialSellers,
  loginSeller,
  addUser,
  loginUser,
  addProduct,
  createOrder,
  User,
  Product,
  Seller,
  Order,
  app,
};
