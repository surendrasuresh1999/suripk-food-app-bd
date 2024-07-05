const express = require("express");
const {
  createNewUser,
  getAllUsers,
  loginUser,
  getUserInformation,
  forgotPassword,
  updatePasswordVerification,
} = require("../Controllers/userController");
const requiredAuth = require("../Middleware/AuthmiddleWare");
const router = express.Router();

// get all users route
router.get("/all", getAllUsers);

// get userinformation route
router.get("/", requiredAuth, getUserInformation);

// signup route
router.post("/signup", createNewUser);

// login route
router.post("/login", loginUser);

// forgot password route
router.put("/reset-password", forgotPassword);

router.put("/reset-password-verify", updatePasswordVerification);

module.exports = router;
