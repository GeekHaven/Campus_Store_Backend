const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("express-async-errors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/product.js");
const orderRoutes = require("./routes/order.js");
const authRoutes = require("./routes/auth.js");
const sellerRoutes = require("./routes/seller.js");
const errorHandler = require("./middleware/errorHandler.js");

const app = express();

app.use(cors());

dotenv.config();
app.use(express.json());
app.use("/product", productRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);
app.use("/seller", sellerRoutes);
app.use(errorHandler);

//Database initiation
mongoose.set("useUnifiedTopology", true);
let url;

if (process.env.NODE_ENV === "test")
  url = "mongodb://localhost:27017/campusstoretest";
else if (process.env.NODE_ENV === "development")
  url = "mongodb://localhost:27017/campusstore";
else url = process.env.MONGODB_URI || "mongodb://localhost:27017/campusstore";

mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log("Connected to ", url, process.env.NODE_ENV);
  }
);

module.exports = app;
