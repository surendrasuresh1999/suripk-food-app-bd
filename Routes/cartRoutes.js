const express = require("express");
const {
  addToCart,
  getCartItems,
  deleteItemFromCart,
  increaseQuantityOfItem,
  decreaseQuantityOfItem,
} = require("../Controllers/cartController");

const requiredAuth = require("../Middleware/AuthmiddleWare");

const router = express.Router();

// before hitting the route it will hit the verify jwt token function
router.use(requiredAuth);

// GET all food items
router.get("/all", getCartItems);

// PUT food item into cart
router.put("/", addToCart);

// PUT increase quantity
router.put("/increase/:id", increaseQuantityOfItem);

// PUT increase quantity
router.put("/decrease/:id", decreaseQuantityOfItem);

// DELETE food item from cart
router.delete("/:id", deleteItemFromCart);

module.exports = router;
