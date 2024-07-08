const express = require("express");

const {
  createNewSubscriber,
  getAllSubscribers,
} = require("../Controllers/subscribersController");

const requiredAuth = require("../Middleware/AuthmiddleWare");
const adminAuth = require("../Admin/AdminMiddleWare");

const router = express.Router();

router.get("/", adminAuth, getAllSubscribers);

router.use(requiredAuth);
// create a new subscriber
router.post("/", createNewSubscriber);

module.exports = router;
