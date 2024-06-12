const express = require("express");
const {
  getFoodItems,
  deleteFoodItem,
  createFoodItem,
} = require("../Controllers/foodItemController");

const requiredAuth = require("../Middleware/AuthmiddleWare");

const router = express.Router();

// ------------ admin routes starts --------------------

// POST a new food item
router.post("/", createFoodItem);

// DELETE food item
router.delete("/:id", deleteFoodItem);

// ------------- admin routes ends --------------------

// before hitting the route it will hit the verify jwt token function
router.use(requiredAuth);

// GET all food items
router.get("/", getFoodItems);


module.exports = router;