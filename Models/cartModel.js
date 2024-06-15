const mongoose = require("mongoose");

const schema = mongoose.Schema;

const cartSchema = new schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    foodItems: [{ type: Object }],
    totalPrice: { type: Number, required: true },
    shippingFee: { type: Number, default: 5 },
    taxEstimate: { type: Number, default: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
