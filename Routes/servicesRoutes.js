const express = require("express");

const router = express.Router();

const requiredAuth = require("../Middleware/AuthmiddleWare");
const {
  createService,
  getAllUserService,
} = require("../Controllers/servicesController");

router.use(requiredAuth);

router.get("/", getAllUserService);
router.post("/", createService);

module.exports = router;
