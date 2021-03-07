const express = require("express");
const { login, signup } = require("../controllers/authController.js");
const router = express.Router();

router.route("/login").post(login);
router.route("/signup").post(signup);

module.exports = router;
