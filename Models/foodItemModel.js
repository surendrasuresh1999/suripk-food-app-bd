const mongoose = require("mongoose");

const schema = mongoose.Schema;

const recipeSchema = new schema(
  {
    // user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    discription: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    rating: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
