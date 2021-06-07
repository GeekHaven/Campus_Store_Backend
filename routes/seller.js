const express = require("express");
const getToken = require("../middleware/getToken");
const router = express.Router();
const {
  getSellerData,
  getSellerProducts,
  loginSeller,
  registerSeller,
  getOrderById,
  modifyOrderStatus,
} = require("../controllers/sellerController");

router.route("/login").post(loginSeller);
router.route("/signup").post(getToken, registerSeller);
router.route("/profile").get(getToken, getSellerData);
router.route("/products").get(getToken, getSellerProducts);
router.route("/orders").get(getToken, getSellerData);
router
  .route("/orders/:id")
  .get(getToken, getOrderById)
  .put(getToken, modifyOrderStatus);

module.exports = router;
