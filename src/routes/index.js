const express = require("express");
const authRoutes = require("./authRoutes");
const groupRoutes = require("./groupRoutes");
const messageRoutes = require("./messageRoutes");
const router = express.Router();
//auth routes
router.use("/auth", authRoutes);
//group routes
router.use("/group", groupRoutes);

//message
router.use("/messages", messageRoutes);

module.exports = router;
