const mongoose = require("mongoose");
const { Schema } = mongoose;

const gameConsoleSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: false, default: 0 },
  manufacturer: { type: String, required: true },
  img_path: {
    type: String,
    default: "/images/placeholder_image.jpg",
  },
});

gameConsoleSchema.virtual("url").get(function () {
  return `/gameConsoles/${this._id}`;
});

gameConsoleSchema.virtual("hasImage").get(function () {
  // Return true if this model has a user uploaded image.
  return this.img_path != "/images/placeholder_image.jpg";
});

module.exports = mongoose.model("GameConsole", gameConsoleSchema);
