const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const subscriberSchema = new Schema(
  {
    email: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("subscribers", subscriberSchema);
