const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const jwtKey = process.env.JWT_KEY;
    const decoded = jwt.verify(token, jwtKey);

    req.userData = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Auth failed" });
  } 
};
