const express = require("express");

const router = express.Router();

const requiredAuth = require("../Middleware/AuthmiddleWare");
const { createService } = require("../Controllers/servicesController");

router.use(requiredAuth);

router.post("/", createService);

module.exports = router;
