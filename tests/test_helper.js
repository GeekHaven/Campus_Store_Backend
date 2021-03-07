const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users.js");
const Order = require("../models/orders");
const Product = require("../models/products");

const initialUsers = [
  //*users with complete details
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

//* directly adds a product to the database
const addProduct = async (sellerid, product) => {
  const newProduct = new Product({
    ...product,
    sellerid,
  });
  return await newProduct.save();
};

//* directly creates an order for a product
const createOrder = async (userid, product) => {
  const order = new Order({
    sellerid: product.sellerid,
    userid,
    product: product.id,
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
