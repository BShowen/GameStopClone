const mongoose = require("mongoose");
const { Schema } = mongoose;

const gameSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  genre: { type: String, required: false },
  description: { type: String, required: true },
  stock: { type: Number, required: false, default: 0 },
  console: { type: Schema.Types.ObjectID, ref: "Console" },
});

gameSchema.virtual("url").get(function () {
  return `/games/${this._id}`;
});

module.exports = mongoose.model("Game", gameSchema);
