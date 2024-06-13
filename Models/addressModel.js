const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressModel = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  addressType: {
    type: String,
    required: true,
  },
  receiversName: { type: String, required: true },
  receiversContact: { type: String, required: true },
  flatHouseNumber: { type: String },
  nearByLandMark: { type: String },
  areaSector: { type: String },
});

module.exports = mongoose.model("address", addressModel);
