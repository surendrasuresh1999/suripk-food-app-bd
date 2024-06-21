const user = require("../Models/userModel");
const orderModel = require("../Models/ordersModel");
const recipeModel = require("../Models/foodItemModel");
const ratingModel = require("../Models/ratingModel");

const getUserAllOrders = async (req, res) => {
  const { _id } = req.user;
  try {
    const isUserExist = await user.findOne({ _id: _id.toString() });
    if (!isUserExist) {
      return res.json({ status: 401, message: "User does not exist" });
    }
    const orders = await orderModel
      .find({ user: _id.toString() })
      .sort({ createdAt: -1 });
    return res.json({ status: true, orders });
  } catch (error) {
    return res.json({ status: 401, message: error.message });
  }
};

// admin purpose update order status
const updateOrder = async (req, res) => {
  const { _id } = req.user;
  const { statusText } = req.body;
  try {
    const order = await orderModel.findOne({
      _id: req.params.id,
    });
    if (!order) {
      return res.json({ status: 404, message: "Order not found" });
    }
    await orderModel.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      { status: statusText }
    );

    return res.json({
      status: true,
      message: "Order status changed successfully",
    });
  } catch (error) {
    return res.json({ status: 404, message: error.message });
  }
};

// drop rating
const dropRatingForFoodItem = async (req, res) => {
  const { _id } = req.user;
  const { rating } = req.body;
  const { itemId, orderId } = req.params;

  try {
    const isOderExist = await orderModel.findById({
      orderId: orderId,
      user: _id.toString(),
    });
    if (!isOderExist) {
      return res.json({ status: 404, message: "Order not found" });
    }

    const isFoodExist = await recipeModel.findById({ _id: itemId });
    if (!isFoodExist) {
      return res.json({ status: 404, message: "food not found" });
    }

    let ratings = [];
    if (isFoodExist && isOderExist && _id.toString()) {
      await ratingModel.create({
        user: _id.toString(),
        orderId: orderId,
        ratings: ratings.push({ foodId: itemId, value: rating }),
      });
      return res.json({
        status: true,
        message: "Thanks for adding your rating",
      });
    }
  } catch (error) {
    return res.json({ status: 401, message: error.message });
  }
};

module.exports = { getUserAllOrders, updateOrder, dropRatingForFoodItem };
