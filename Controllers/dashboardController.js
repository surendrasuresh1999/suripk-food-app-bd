const orderModel = require("../Models/ordersModel");
const itemsModel = require("../Models/foodItemModel");
const usersModel = require("../Models/userModel");
const adminModel = require("../Models/adminModel");
const {
  sendOrdersFullData,
  sendUsersFullData,
  sendItemsFullData,
  generateOrdersYearChartData,
  generateUsersYearChartData,
} = require("../Services/dashbordSevice");

const getFullDashBoardData = async (req, res) => {
  const { _id } = req.user;
  try {
    const isAdmin = await adminModel.findOne({ _id: _id.toString() });
    if (!isAdmin) {
      return res.json({ status: 404, message: "Admin not found" });
    }
    // find admin user is authorized to access the full dashboard
    const orders = await orderModel.find().sort({ createdAt: -1 });
    const users = await usersModel.find().sort({ createdAt: -1 });
    const items = await itemsModel.find().sort({ createdAt: -1 });
    const totalAmount = orders.reduce(
      (acc, order) => acc + order.totalAmount,
      0
    );

    return res.json({
      status: true,
      message: "fetched dashboard data",
      data: [
        sendUsersFullData(users),
        sendOrdersFullData(orders),
        sendItemsFullData(items),
        { total: totalAmount, percentage: "100%" },
      ],
      ordersChartData: generateOrdersYearChartData(orders),
      usersChartData: generateUsersYearChartData(users),
    });
  } catch (error) {
    return res.json({ status: 404, message: error.message });
  }
};

module.exports = { getFullDashBoardData };
