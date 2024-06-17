const crypto = require("crypto");
const Razorpay = require("razorpay");
const orderModel = require("../Models/ordersModel");
const userModel = require("../Models/userModel");
const addressModel = require("../Models/addressModel");
const cartModel = require("../Models/cartModel");

const placingOrder = async (req, res) => {
  const instance = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY,
    key_secret: process.env.RAZOR_PAY_SECRET_STRING,
  });
  //   console.log(process.env.RAZOR_PAY_KEY);
  if (!req.body.totalAmount) {
    return res.json({ status: 404, message: "Bad request" });
  }
  var options = {
    amount: Number(req.body.totalAmount) * 100,
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  return res.json({ status: true, order });
};

const paymentVerification = async (req, res) => {
  const { _id } = req.user;
  const { response, items, addressId, totalAmount } = req.body;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    response;

  try {
    const user = await userModel.findOne({ _id: _id.toString() });
    if (!user) {
      return res.json({ status: 404, message: "User not found" });
    }
    const deliveryAddress = await addressModel.findOne({
      user: _id.toString(),
      _id: addressId,
    });

    if (!deliveryAddress) {
      return res.json({ status: 404, message: "Address not found" });
    }

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZOR_PAY_SECRET_STRING)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.json({
        status: 400,
        message: "Invalid payment",
      });
    }

    const newOrder = new orderModel({
      user: _id,
      orderItems: items,
      deliveryAddress: deliveryAddress,
      paymentInfo: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      },
      totalAmount: totalAmount / 100,
      status: "Preparing",
    });

    await newOrder.save();
    await cartModel.updateMany({
      $set: { foodItems: [] },
    });
    return res.json({ status: true, message: "Payment successful" });
  } catch (error) {
    return res.json({ status: 400, message: error.message });
  }
};

module.exports = {
  placingOrder,
  paymentVerification,
};
