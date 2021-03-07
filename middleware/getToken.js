const jwt = require("jsonwebtoken");

const getToken = (req, res, next) => {
  const token = req.headers.authorization;
  console.log("The initial token is ", token);
  if (!token || !token.toLowerCase().startsWith("bearer"))
    return res.status(401).json({ error: "Unauthorized" });

  const decodedToken = jwt.decode(token.substring(7), process.env.SECRET);

  if (!decodedToken) return res.status(401).json({ error: "Unauthorized" });
  req.token = decodedToken;

  next();
};

module.exports = getToken;
