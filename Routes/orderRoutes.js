const express = require("express");

const router = express.Router();

const auth = require("../Middleware/AuthmiddleWare");
const {
  getUserAllOrders,
  updateOrder,
  dropRatingForFoodItem,
} = require("../Controllers/orderController");

router.use(auth);

router.get("/", getUserAllOrders);
router.put("/:id", updateOrder);
router.put("/:orderId/:itemId", dropRatingForFoodItem);

module.exports = router;
