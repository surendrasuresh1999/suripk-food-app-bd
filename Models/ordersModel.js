const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderItems: [{ type: Object }],
  deliveryAddress: {},
  paymentInfo: {},
});

module.exports = mongoose.model("Orders", orderSchema);
