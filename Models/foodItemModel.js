const mongoose = require("mongoose");

const schema = mongoose.Schema;

const recipeSchema = new schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  discription: { type: String, required: true },
  price: { type: Number, required: true },
});

module.exports = mongoose.model("Recipe", recipeSchema);
