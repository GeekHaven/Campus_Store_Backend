import jwt from "jsonwebtoken";

const getToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("The initial token is ", token);
  if (!token || !token.toLowerCase().startsWith("bearer")) return null;
  req.token = jwt.decode(token.substring(7), process.env.SECRET);
  next();
};

export default getToken;
