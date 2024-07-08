const recipeModel = require("../Models/foodItemModel");
const ratingModel = require("../Models/ratingModel");
const adminModel = require("../Models/adminModel");

// fetch all food items
const getFoodItems = async (req, res) => {
  try {
    const foodItems = await recipeModel.find().sort({ createdAt: -1 });
    const ratings = await ratingModel.find().sort({ createdAt: -1 });
    // Map ratings to a more usable structure for calculating averages
    const ratingMap = new Map();

    ratings.forEach((rating) => {
      rating.ratings.forEach((ratingItem) => {
        const productId = ratingItem.foodId.toString();
        const ratingValue = ratingItem.value;

        if (ratingMap.has(productId)) {
          ratingMap.get(productId).push(ratingValue);
        } else {
          ratingMap.set(productId, [ratingValue]);
        }
      });
    });

    // console.log("asdfsadf",ratingMap);
    // Calculate average rating for each food item
    foodItems.forEach(async (foodItem) => {
      const productId = foodItem._id.toString();

      if (ratingMap.has(productId)) {
        const ratings = ratingMap.get(productId);
        // console.log(productId,ratings)
        const averageRating =
          ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
        foodItem.rating = averageRating.toFixed(1);

        // Save updated foodItem back to the database
        try {
          await foodItem.save(); // Save the updated foodItem to MongoDB
        } catch (error) {
          console.error(
            `Error saving food item ${foodItem._id} with average rating:`,
            error
          );
        }
      } else {
        foodItem.rating = 0;
      }
    });

    return res.json({
      status: 200,
      messages: "Successfully fetched receipes",
      foodItems,
    });
  } catch (error) {
    return res.json({ status: 401, messages: error.messages });
  }
};

// admin routes
// create a food item
const createFoodItem = async (req, res) => {
  const { _id } = req.user;
  // console.log(req.body);
  try {
    const isAdmin = await adminModel.findOne({ _id: _id.toString() });
    if (!isAdmin) {
      return res.json({ status: 404, message: "Admin not found" });
    }
    const image = req.body.imageUrl;
    // Replace 'http://' with 'https://'
    const secureUrl = image.replace(/^http:\/\//i, "https://");

    const foodItem = await recipeModel.create({
      ...req.body,
      imageUrl: secureUrl,
    });

    res.json({
      message: "Food item created Successfully",
      foodItem,
      status: true,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.json({ status: 400, message: error.message });
  }
};

// fetch all food items
const getAllFoodItems = async (req, res) => {
  const { _id } = req.user;
  try {
    const isAdmin = await adminModel.findOne({ _id: _id.toString() });
    if (!isAdmin) {
      return res.json({ status: 404, message: "Admin not found" });
    }
    const foodItems = await recipeModel.find().sort({ createdAt: -1 });
    const ratings = await ratingModel.find().sort({ createdAt: -1 });
    // Map ratings to a more usable structure for calculating averages
    const ratingMap = new Map();

    ratings.forEach((rating) => {
      rating.ratings.forEach((ratingItem) => {
        const productId = ratingItem.foodId.toString();
        const ratingValue = ratingItem.value;

        if (ratingMap.has(productId)) {
          ratingMap.get(productId).push(ratingValue);
        } else {
          ratingMap.set(productId, [ratingValue]);
        }
      });
    });

    // console.log("asdfsadf",ratingMap);
    // Calculate average rating for each food item
    foodItems.forEach(async (foodItem) => {
      const productId = foodItem._id.toString();

      if (ratingMap.has(productId)) {
        const ratings = ratingMap.get(productId);
        // console.log(productId,ratings)
        const averageRating =
          ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
        foodItem.rating = averageRating.toFixed(1);

        // Save updated foodItem back to the database
        try {
          await foodItem.save(); // Save the updated foodItem to MongoDB
        } catch (error) {
          console.error(
            `Error saving food item ${foodItem._id} with average rating:`,
            error
          );
        }
      } else {
        foodItem.rating = 0;
      }
    });

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
    const isAdmin = await adminModel.findOne({ _id: _id.toString() });
    if (!isAdmin) {
      return res.json({ status: 404, message: "Admin not found" });
    }
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

// delete a food item
const deleteFoodItem = async (req, res) => {
  const { _id } = req.user;
  try {
    const isAdmin = await adminModel.findOne({ _id: _id.toString() });
    if (!isAdmin) {
      return res.json({ status: 404, message: "Admin not found" });
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

module.exports = {
  createFoodItem,
  deleteFoodItem,
  getFoodItems,
  getAllFoodItems,
  updateFoodItem,
};
