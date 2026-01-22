const express = require("express");
const createMessage = require("../controllers/messageController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create-message/:groupId", authMiddleware, createMessage);

module.exports = router;
