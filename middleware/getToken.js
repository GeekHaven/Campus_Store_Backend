const jwt = require("jsonwebtoken");

const getToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.toLowerCase().startsWith("bearer"))
    return res.status(401).json({ error: "Unauthorized" });

  const decodedToken = jwt.verify(token.substring(7), process.env.SECRET);

  if (!decodedToken) return res.status(401).json({ error: "Unauthorized" });
  req.token = decodedToken;
  next();
};

module.exports = getToken;
