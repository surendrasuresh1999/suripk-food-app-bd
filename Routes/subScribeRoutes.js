const express = require("express");

const { createNewSubscriber, getAllSubscribers } = require("../Controllers/subscribersController");

const requiredAuth = require("../Middleware/AuthmiddleWare");

const router = express.Router();

router.use(requiredAuth);

// create a new subscriber
router.get("/", getAllSubscribers);
router.post("/", createNewSubscriber);

module.exports = router;
