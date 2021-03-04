import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "express-async-errors";
import dotenv from "dotenv";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors());

dotenv.config();
app.use(express.json());
app.use("/product", productRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);
app.use(errorHandler);

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
