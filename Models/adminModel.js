const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminModel = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminModel);
