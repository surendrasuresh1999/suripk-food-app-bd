const adminModel = require("../Models/adminModel");
const subScriberModel = require("../Models/subscriberModel");
const userModel = require("../Models/userModel");

const createNewSubscriber = async (req, res) => {
  const { _id } = req.user;
  const { email, name } = req.body;
  try {
    const isUserExist = await userModel.findById({ _id: _id.toString() });
    if (!isUserExist) {
      return res.json({ status: false, message: "User does not exist" });
    }
    await subScriberModel.create({
      email,
      name,
      status: "active",
    });
    return res.json({
      status: true,
      message: "Thanks for subscribing our website",
    });
  } catch (error) {
    return res.json({ status: 404, error: error.message });
  }
};

const getAllSubscribers = async (req, res) => {
  const { _id } = req.user;
  try {
    const isAdminExist = await adminModel.find({ _id: _id.toString() });

    if (!isAdminExist) {
      return res.json({
        status: 404,
        message: "Sorry, you are not allowed to access this",
      });
    }
    const subscribers = await subScriberModel.find();
    return res.json({
      status: true,
      message: "Fetching all subscribers",
      subscribers,
    });
  } catch (error) {
    return res.json({ status: 404, error: error.message });
  }
};

module.exports = { createNewSubscriber, getAllSubscribers };
