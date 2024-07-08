const express = require("express");

const router = express.Router();

const requireAuth = require("../Admin/AdminMiddleWare");
const {
  loginAdmin,
  signupAdmin,
  forgotPasswordAdmin,
  updatePasswordVerificationAdmin,
} = require("../Controllers/adminController");

router.use(requireAuth);

router.post("/signup", signupAdmin);

// login route
router.post("/login", loginAdmin);

// forgot password route
router.put("/reset-password", forgotPasswordAdmin);

router.put(
  "/reset-password-verify/:id/:token",
  updatePasswordVerificationAdmin
);

module.exports = router;
