const express = require("express");

const router = express.Router();

const requiredAuth = require("../Middleware/AuthmiddleWare");
const adminAuth = require("../Admin/AdminMiddleWare");
const {
  createService,
  getAllUserService,
  getAllUserServicesAdmin,
} = require("../Controllers/servicesController");

router.get("/admin", adminAuth, getAllUserServicesAdmin);

router.use(requiredAuth);
router.post("/", createService);
router.get("/", getAllUserService);

module.exports = router;
