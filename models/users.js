const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.passwordHash;
  },
});

userSchema.plugin(uniqueValidator);
const User = mongoose.model("User", userSchema);
module.exports = User;
