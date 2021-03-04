import bcrypt from "bcrypt";
import User from "../models/users.js";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  const { password, email, ...restBody } = req.body;
  if (!email)
    return res
      .status(400)
      .json({ error: "The email field should not be empty" });
  if (password.length <= 6)
    return res
      .status(400)
      .json({ error: "Enter a password with more than 6 characters" });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({
    ...restBody,
    passwordHash,
  });
  const done = await user.save();
  done ? res.status(201).end() : res.status(500).end();
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Enter all the details" });

  const user = await User.findOne({ email });
  const authenticated =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);
  if (!authenticated)
    return res.status(401).json({ error: "Invalid credentials" });

  const tokenUser = {
    email: user.email,
    id: user._id,
  };

  const token = jwt.sign(tokenUser, process.env.SECRET);
  res.status(200).json({ token, tokenUser });
};

export { signup, login };
