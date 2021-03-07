const express = require("express");
const getToken = require("../middleware/getToken.js");
const router = express.Router();
const {
  getProductId,
  createProduct,
  placeOrder,
  getAllProducts,
} = require("../controllers/productController.js");

router.route("/").get(getAllProducts);
router.route("/:id").get(getProductId);
router.route("/:id/order").get(getProductId).post(getToken, placeOrder);
router.route("/create").post(getToken, createProduct);

module.exports = router;
