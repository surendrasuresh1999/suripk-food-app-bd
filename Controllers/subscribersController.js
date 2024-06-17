const subScriberModel = require("../Models/subscriberModel");
const userModel = require("../Models/userModel");

const createNewSubscriber = async (req, res) => {
  const { _id } = req.user;
  try {
    const isUserExist = await userModel.findById({ _id: _id.toString() });
    if (!isUserExist) {
      return res.json({ status: false, message: "User does not exist" });
    }
    await subScriberModel.create({
      email: req.body.email,
    });
    return res.json({
      status: true,
      message: "Thanks for subscribing our website",
    });
  } catch (error) {
    return res.json({ status: 404, error: error.message });
  }
};

module.exports = { createNewSubscriber };
