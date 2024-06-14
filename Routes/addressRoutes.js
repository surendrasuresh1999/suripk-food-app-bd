const express = require("express");

const requiredAuth = require("../Middleware/AuthmiddleWare");
const {
  createAddress,
  getUserAddress,
  deleteAddress,
} = require("../Controllers/addressController");

const router = express.Router();

router.use(requiredAuth);

router.get("/", getUserAddress);
router.post("/", createAddress);
router.delete("/:id", deleteAddress);

module.exports = router;
