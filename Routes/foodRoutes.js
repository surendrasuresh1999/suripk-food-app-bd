const express = require("express");
const {
  getFoodItems,
  deleteFoodItem,
  createFoodItem,
  updateFoodItem,
} = require("../Controllers/foodItemController");

const requiredAuth = require("../Middleware/AuthmiddleWare");

const router = express.Router();

// before hitting the route it will hit the verify jwt token function
router.use(requiredAuth);

// ------------ admin routes starts --------------------

// POST a new food item
router.post("/", createFoodItem);

// UPDATE food item
router.put("/:id", updateFoodItem);

// DELETE food item
router.delete("/:id", deleteFoodItem);

// ------------- admin routes ends --------------------

// GET all food items
router.get("/", getFoodItems);

module.exports = router;
