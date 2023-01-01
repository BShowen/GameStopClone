const mongoose = require("mongoose");
const { Schema } = mongoose;

const accessorySchema = new Schema({
  name: { type: String, required: true },
  gameConsole: { type: Schema.Types.ObjectID, ref: "GameConsole" },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true },
  img_path: {
    type: String,
    default: "/images/placeholder_image.jpg",
  },
});

accessorySchema.virtual("url").get(function () {
  return `/accessories/${this._id}`;
});

accessorySchema.virtual("hasImage").get(function () {
  // Return true if this model has a user uploaded image.
  return this.img_path != "/images/placeholder_image.jpg";
});

module.exports = mongoose.model("Accessory", accessorySchema);
