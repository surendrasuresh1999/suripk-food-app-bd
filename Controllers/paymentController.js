const crypto = require("crypto");
const Razorpay = require("razorpay");

const placingOrder = async (req, res) => {
  const instance = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY,
    key_secret: process.env.RAZOR_PAY_SECRET_STRING,
  });
  //   console.log(process.env.RAZOR_PAY_KEY);
  var options = {
    amount: Number(req.body.totalAmount) * 100,
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  return res.json({ status: true, order });
};

const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body.response;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZOR_PAY_SECRET_STRING)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database store all fields in db comes here

    console.log("payment successfully authenticated");

    res.redirect(
      `http://localhost:5173/my-orders?paymentsuccess&reference=${razorpay_payment_id}`
    );
    // ?paymentsuccess&reference=${razorpay_payment_id}
  } else {
    return res.json({
      status: 400,
      message: "Invalid payment",
    });
  }
};

module.exports = {
  placingOrder,
  paymentVerification,
};
