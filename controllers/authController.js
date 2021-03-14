const bcrypt = require("bcrypt");
const User = require("../models/users.js");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { password, email, ...restBody } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ error: "Email and password fields are required" });

  if (password.length <= 6)
    return res
      .status(400)
      .json({ error: "Password must be longer than 6 characters" });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({
    email,
    ...restBody,
    passwordHash,
  });
  await user.save();
  res.status(201).end();
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Please enter all the details" });

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(401)
      .json({ error: "Email does not exist. Please signup first." });

  const authenticated = await bcrypt.compare(password, user.passwordHash);
  if (!authenticated)
    return res.status(401).json({ error: "Invalid credentials" });

  const tokenUser = {
    email: user.email,
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(tokenUser, process.env.SECRET, { expiresIn: "5d" });
  res.json({ token, tokenUser });
};

module.exports = { signup, login };
