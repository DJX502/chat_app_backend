const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const {
  register,
  login,
  updateUser,
  getUser,
  getAllUser,
} = require("../controllers/authController");

router.post("/user-register", register);
router.post("/user-login", login);
router.put("/user-update", authMiddleware, updateUser);
router.get("/user-get", authMiddleware, getUser);
router.get("/users-get", getAllUser);

module.exports = router;
