const recipeModel = require("../Models/foodItemModel");
const userModel = require("../Models/userModel");
const mongoose = require("mongoose");

// create a food item
const createFoodItem = async (req, res) => {
  // const { _id } = req.user;
  // console.log(req.body);
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
    return res.json({ status: true, message: "Food item deleted" });
  } catch (error) {
    return res.json({ status: 401, message: error.message });
  }
};

// fetch all food items
const getFoodItems = async (req, res) => {
  // const { _id } = req.user;
  try {
    const foodItems = await recipeModel.find().sort({ createdAt: -1 });
    return res.json({
      status: 200,
      messages: "Successfully fetched receipes",
      foodItems,
    });
  } catch (error) {
    return res.json({ status: 401, messages: error.messages });
  }
};

const updateFoodItem = async (req, res) => {
  const { _id } = req.user;
  try {
    isFoodExist = await recipeModel.findById(req.params.id);
    if (!isFoodExist) {
      return res.json({ status: 404, message: "food item not found" });
    }
    await recipeModel.findByIdAndUpdate(req.params.id, req.body);
    return res.json({
      status: true,
      message: "food item updated successfully!",
    });
  } catch (error) {
    return res.json({ status: 404, message: error.message });
  }
};

module.exports = {
  createFoodItem,
  deleteFoodItem,
  getFoodItems,
  updateFoodItem,
};
