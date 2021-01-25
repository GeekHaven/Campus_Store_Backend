import express from "express";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import authRoutes from "./routes/auth.js";
import mongoose from "mongoose";
import "express-async-errors";
import dotenv from "dotenv";
const app = express();

dotenv.config();
app.use(express.json());
app.use("/product", productRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);

//Database initiation
mongoose.set("useUnifiedTopology", true);
const url = "mongodb://localhost:27017/campusstore";

mongoose.connect(
  url,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => {
    console.log("Connected");
  }
);

app.listen(3001, () => {
  console.log("Listening to port 3001");
});
