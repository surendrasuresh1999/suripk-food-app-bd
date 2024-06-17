const express = require("express");

const router = express.Router();

const auth = require("../Middleware/AuthmiddleWare");
const {
  getUserAllOrders,
  updateOrder,
} = require("../Controllers/orderController");

router.use(auth);

router.get("/", getUserAllOrders);
router.put("/:id", updateOrder);

module.exports = router;
