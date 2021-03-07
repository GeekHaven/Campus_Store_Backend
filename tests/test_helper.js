const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users.js");
const Order = require("../models/orders");
const Product = require("../models/products");

const initialUsers = [
  {
    username: "sarthak",
    email: "sarthak@gmail.com",
    password: "sarthak",
    isSeller: true,
  },
  {
    username: "hacker",
    password: "linuxisbest",
    email: "linuxuser@gmail.com",
  },
  {
    username: "hacker",
    email: "linuxuser@gmail.com",
  },
  {
    username: "hacker",
    password: "linuxuser@gmail.com",
  },
  {
    username: "hacker",
    password: "short",
    email: "linuxuser@gmail.com",
  },
];

const initialProducts = [
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
];

const addUser = async ({ password, ...restData }) => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({
    passwordHash,
    ...restData,
  });
  return await user.save();
};

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

const addProduct = async (sellerid, product) => {
  const newProduct = new Product({
    ...product,
    sellerid,
  });
  return await newProduct.save();
};

const createOrder = async (user, product) => {
  const order = new Order({
    sellerid: product.sellerid,
    userid: user._id,
    product: product._id,
  });
  return await order.save();
};

module.exports = {
  initialProducts,
  initialUsers,
  addUser,
  loginUser,
  addProduct,
  createOrder,
};
