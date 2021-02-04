import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sellerid: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  price: {
    type: "Number",
    required: true,
  },
  description: String,
  image: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
