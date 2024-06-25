const orderModel = require("../Models/ordersModel");
const itemsModel = require("../Models/foodItemModel");
const usersModel = require("../Models/userModel");
const {
  sendOrdersFullData,
  sendUsersFullData,
  sendItemsFullData,
  generateOrdersYearChartData,
} = require("../Services/dashbordSevice");

const getFullDashBoardData = async (req, res) => {
  const { _id } = req.user;
  try {
    // find admin user is authorized to access the full dashboard
    const orders = await orderModel.find().sort({ createdAt: -1 });
    const users = await usersModel.find().sort({ createdAt: -1 });
    const items = await itemsModel.find().sort({ createdAt: -1 });

    return res.json({
      status: true,
      message: "fetched dashboard data",
      data: [
        sendUsersFullData(users),
        sendOrdersFullData(orders),
        sendItemsFullData(items),
      ],
      ordersChartData: generateOrdersYearChartData(orders),
    });
  } catch (error) {
    return res.json({ status: 404, message: error.message });
  }
};

module.exports = { getFullDashBoardData };
