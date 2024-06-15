const express = require("express");

const router = express.Router();

const auth = require("../Middleware/AuthmiddleWare");
const { getUserAllOrders } = require("../Controllers/orderController");

router.use(auth);

router.get("/", getUserAllOrders);

module.exports = router;
