const jwt = require("jsonwebtoken");
require("dotenv").config();
async function authMiddleware(req, res, next) {
  const key = process.env.JWT_SECRET_KEY;
  const token =
    req.headers.authorization?.split(" ")[1] ||
    req.headers.Authorization?.split(" ")[1];
  try {
    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: "token not found" });
    }

    const result = await jwt.verify(token, key);
    req.user = result;
    return next();
  } catch (err) {
    res.status(403).json({ status: false, message: "session expired" });
  }
}

async function userMiddleware(req, res, next) {}
module.exports = authMiddleware;
