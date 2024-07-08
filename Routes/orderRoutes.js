const express = require("express");

const router = express.Router();

const auth = require("../Middleware/AuthmiddleWare");
const adminAuth = require("../Admin/AdminMiddleWare");
const {
  getUserAllOrders,
  updateOrder,
  dropRatingForFoodItem,
  getAllOrders,
} = require("../Controllers/orderController");

// below routes are admin routes
router.get("/admin", adminAuth, getAllOrders);
router.put("/:id", adminAuth, updateOrder);

// below routes are client routes
router.use(auth);
router.get("/", getUserAllOrders);

router.put("/:orderId/:itemId", dropRatingForFoodItem);

module.exports = router;
