const addressModel = require("../Models/addressModel");
const userModel = require("../Models/userModel");

const createAddress = async (req, res) => {
  const { _id } = req.user;

  try {
    const isUserExist = await userModel.findOne({ _id: _id.toString() });
    if (!isUserExist) {
      return res.json({ status: false, message: "User does not exist" });
    }
    const { addressType, name, phone, landmark, address, flatNumber } =
      req.body;
    await addressModel.create({
      user: _id,
      addressType,
      receiversName: name,
      receiversContact: phone,
      flatHouseNumber: flatNumber,
      nearByLandMark: landmark,
      areaSector: address,
    });
    return res.json({ status: true, message: "Address saved successfully" });
  } catch (error) {
    return res.json({ status: 404, message: error.message });
  }
};

const getUserAddress = async (req, res) => {
  const { _id } = req.user;
  try {
    const address = await addressModel.find({ user: _id.toString() });
    return res.json({ status: true, address });
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

module.exports = { createAddress, getUserAddress };
