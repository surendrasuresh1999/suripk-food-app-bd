const express = require("express");
const {
  getFoodItems,
  deleteFoodItem,
  createFoodItem,
  updateFoodItem,
  getAllFoodItems,
} = require("../Controllers/foodItemController");

const requiredAuth = require("../Middleware/AuthmiddleWare");
const adminAuth = require("../Admin/AdminMiddleWare");

const router = express.Router();
// ------------- admin routes starts --------------------

router.use(adminAuth);
// GET all food items
router.get("/admin", getAllFoodItems);

// UPDATE food item
router.put("/:id", updateFoodItem);

// DELETE food item
router.delete("/:id", deleteFoodItem);

// POST a new food item
router.post("/", createFoodItem);

// ------------- admin routes ends --------------------

// before hitting the route it will hit the verify jwt token function
router.use(requiredAuth);

// GET all food items
router.get("/", getFoodItems);

module.exports = router;
