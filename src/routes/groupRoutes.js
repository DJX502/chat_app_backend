const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createGroup,
  addMember,
  getMembers,
} = require("../controllers/groupController");
const router = express.Router();

router.post("/create-group", authMiddleware, createGroup);
router.post("/:groupId", authMiddleware, addMember);
router.get("/:groupId", authMiddleware, getMembers);

module.exports = router;
