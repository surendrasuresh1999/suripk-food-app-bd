const adminModel = require("../Models/adminModel");
const servicesModel = require("../Models/servicesModel");

const createService = async (req, res) => {
  const { _id } = req.user;
  // console.log(req.body);
  try {
    await servicesModel.create({
      user: _id,
      ...req.body,
    });
    return res.json({
      status: true,
      message: "Thanks for booking our service",
    });
  } catch (error) {
    return res.json({ status: 404, message: error.message });
  }
};

const getAllUserService = async (req, res) => {
  const { _id } = req.user;
  try {
    const services = await servicesModel.find({ user: _id.toString() });
    return res.json({
      status: true,
      services,
      message: "Fetching all user services",
    });
  } catch (error) {
    return res.json({ status: 404, message: error.message });
  }
};

const getAllUserServicesAdmin = async (req, res) => {
  const { _id } = req.user;
  try {
    const isAdminExist = await adminModel.findOne({ _id: _id.toString() });

    if (!isAdminExist) {
      return res.json({
        status: 404,
        message: "Sorry, you are not allowed to access this",
      });
    }
    const services = await servicesModel.find();
    return res.json({
      status: true,
      services,
      message: "Fetching all user services",
    });
  } catch (error) {
    return res.json({ status: 404, message: error.message });
  }
};

module.exports = { createService, getAllUserService, getAllUserServicesAdmin };
