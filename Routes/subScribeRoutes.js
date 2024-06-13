const express = require("express");

const { createNewSubscriber } = require("../Controllers/subscribersController");

const requiredAuth = require("../Middleware/AuthmiddleWare");

const router = express.Router();

router.use(requiredAuth);

// create a new subscriber
router.post("/", createNewSubscriber);

module.exports = router;
