const { prisma } = require("../config/database");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
//register user function
async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(403)
      .json({ status: false, message: "all the fields are required!!" });
  }
  try {
    const existingUser = await prisma.users.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      return res
        .status(403)
        .json({ status: false, message: "email already accquired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });
    const token = await generateToken(user.id);
    return res.status(201).json({
      status: true,
      message: "user registered successfully",
      data: user,
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "internal server error",
      error: err.message,
    });
  }
}

//login user function

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: false, message: "Enter login email and passowrd" });
  }
  try {
    const user = await prisma.users.findUnique({ where: { email: email } });
    if (!user) {
      return res.status(403).json({ status: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(403)
        .json({ status: false, message: "login credientials Invalid" });
    }
    const token = await generateToken(user.id);
    return res.status(200).json({
      status: true,
      message: "Login Successfully",
      data: user,
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
}

//update user function
async function updateUser(req, res) {
  try {
    console.log("req.body>>>>>>>", req);
    const { email, name, bio } = req.body;

    if (!email && !name && !bio) {
      return res.status(403).json({
        status: false,
        message: "email and name cannot be left blank",
      });
    }

    // id from token (set in authMiddleware: req.user = decoded)
    const userId = req.user.userId;
    if (email) {
      const existingEmail = await prisma.users.findUnique({
        where: { email: email },
      });
      if (existingEmail) {
        return res
          .status(403)
          .json({ status: false, message: "Email already taken" });
      }
    }

    // build data object only with provided fields
    const data = {};
    if (email) data.email = email;
    if (name) data.name = name;
    if (bio) data.bio = bio;

    const updatedUser = await prisma.users.update({
      where: { id: userId }, // must be unique in your Prisma schema
      data,
    });

    return res.status(200).json({
      status: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    // console.error("updateUser error >>>>>", error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}

//get single user by and token

async function getUser(req, res) {
  const { userId } = req.user;
  try {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "User data not found" });
    }
    return res
      .status(200)
      .json({ status: true, message: "user data found", data: user });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      message: err.message,
    });
  }
}

async function getAllUser(req, res) {
  try {
    const users = await prisma.users.findMany();
    res.status(200).json({
      status: true,
      message: "users found that can be shown to admin dashboard",
      data: users,
    });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: "internal server error",
      error: e.message,
    });
  }
}

module.exports = { register, login, updateUser, getUser, getAllUser };
