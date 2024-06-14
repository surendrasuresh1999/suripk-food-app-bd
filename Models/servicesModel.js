const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventLocation: { type: String, required: true },
  eventTitle: { type: String, required: true },
  NumberOfGuests: { type: String, required: true },
  SpecialRequests: { type: String },
});

module.exports = mongoose.model("services", serviceSchema);
