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

module.exports = { createService, getAllUserService };
