const mongoose = require("mongoose");
const { Schema } = mongoose;

const accessorySchema = new Schema({
  name: { type: String, required: true },
  console: { type: Schema.Types.ObjectID, ref: "GameConsole" },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
});

module.exports = mongoose.model("Accessory", accessorySchema);
