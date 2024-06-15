const user = require("../Models/userModel");
const orderModel = require("../Models/ordersModel");

const getUserAllOrders = async (req, res) => {
  const { _id } = req.user;
  try {
    const isUserExist = await user.findOne({ _id: _id.toString() });
    if (!isUserExist) {
      return res.json({ status: 401, message: "User does not exist" });
    }
    const orders = await orderModel.find({ user: _id.toString() });
    return res.json({ status: true, orders });
  } catch (error) {
    return res.json({ status: 401, message: error.message });
  }
};
module.exports = { getUserAllOrders };
