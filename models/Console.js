const mongoose = require("mongoose");
const { Schema } = mongoose;

const consoleSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: false, default: 0 },
  manufacturer: { type: String, required: true },
});

consoleSchema.virtual("url").get(function () {
  return `/consoles/${this._id}`;
});

module.exports = mongoose.model("Console", consoleSchema);
