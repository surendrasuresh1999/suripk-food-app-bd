const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
      required: true,
    },
    likedUsers: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
