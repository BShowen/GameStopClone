const mongoose = require("mongoose");
const { Schema } = mongoose;

const gameSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  genre: { type: String, required: false },
  description: { type: String, required: true },
  stock: { type: Number, required: false, default: 0 },
  console: { type: Schema.Types.ObjectID, ref: "GameConsole" },
  img_path: {
    type: String,
    default: "/images/placeholder_image.jpg",
  },
});

gameSchema.virtual("url").get(function () {
  return `/games/${this._id}`;
});

gameSchema.virtual("hasImage").get(function () {
  // Return true if this model has a user uploaded image.
  return this.img_path != "/images/placeholder_image.jpg";
});

module.exports = mongoose.model("Game", gameSchema);
