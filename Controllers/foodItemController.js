const recipeModel = require("../Models/foodItemModel");
const mongoose = require("mongoose");

// create a food item

const createFoodItem = async (req, res) => {
  const { _id } = req.user;
  try {
    const foodItem = await recipeModel.create({
      user: _id.toString(),
      ...req.body,
    });
    res.json({
      message: "Food item created Successfully",
      foodItem,
      status: 200,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.json({ status: 400, message: error.message });
  }
};



module.exports = { createFoodItem };
