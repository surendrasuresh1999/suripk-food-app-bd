const recipeModel = require("../Models/foodItemModel");
const mongoose = require("mongoose");

// create a food item
const createFoodItem = async (req, res) => {
  // const { _id } = req.user;
  try {
    const foodItem = await recipeModel.create({
      // user: _id.toString(),
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

// delete a food item
const deleteFoodItem = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.json({ staus: 401, error: "Invalid food item ID" });
    }
    const isRecepieExist = await recipeModel.findById(req.params.id);

    if (!isRecepieExist) {
      return res.json({ status: 404, message: "Food item not found" });
    }

    await recipeModel.findByIdAndDelete(req.params.id);
    return res.json({ status: 200, message: "Food item deleted" });
  } catch (error) {
    return res.json({ status: 401, message: error.message });
  }
};

// fetch all food items
const getFoodItems = async (req, res) => {
  // const { _id } = req.user;
  try {
    const foodItems = await recipeModel.find({ user: _id });
    return res.json({ status: 200, messages: foodItems });
  } catch (error) {
    return res.json({ status: 401, messages: error.messages });
  }
};

// update food item information
// const updateFoodItemInfo = async (req, res) => {
//   const { _id } = req.user;
//   try {
//     return res.js
//   } catch (error) {}
// };

module.exports = {
  createFoodItem,
  deleteFoodItem,
  getFoodItems,
  // updateFoodItemInfo,
};
