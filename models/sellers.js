const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  username: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

sellerSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.passwordHash;
  },
});

sellerSchema.plugin(uniqueValidator);
const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
