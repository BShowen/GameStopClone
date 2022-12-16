const mongoose = require("mongoose");
const { Schema } = mongoose;

const gameConsoleSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: false, default: 0 },
  manufacturer: { type: String, required: true },
});

gameConsoleSchema.virtual("url").get(function () {
  return `/gameConsoles/${this._id}`;
});

module.exports = mongoose.model("GameConsole", gameConsoleSchema);
