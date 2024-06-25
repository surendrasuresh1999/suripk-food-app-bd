const express = require("express");

const router = express.Router();

// const requireAuth = require("../Middleware/AuthmiddleWare");
const {
  loginAdmin,
  signupAdmin,
  forgotPasswordAdmin,
} = require("../Controllers/adminController");

// router.use(requireAuth);

router.post("/signup", signupAdmin);

// login route
router.post("/login", loginAdmin);

// forgot password route
router.put("/update-password", forgotPasswordAdmin);

module.exports = router;
