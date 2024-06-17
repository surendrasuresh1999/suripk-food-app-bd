const user = require("../Models/userModel");
const orderModel = require("../Models/ordersModel");

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

const updateOrder = async (req, res) => {
  const { _id } = req.user;
  const { status } = req.body;
  try {
    const order = await orderModel.findOne({
      _id: req.params.id,
      user: _id.toString(),
    });
    if (!order) {
      return res.json({ status: 404, message: "Order not found" });
    }
    await orderModel.findByIdAndUpdate(
      {
        _id: req.params.id,
        user: _id.toString(),
      },
      { status: status }
    );

    return res.json({ status: true, message: "Order updated successfully" });
  } catch (error) {
    return res.json({ status: 404, message: error.message });
  }
};
module.exports = { getUserAllOrders, updateOrder };
