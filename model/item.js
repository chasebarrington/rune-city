const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  _id: { type: Number, unique: true },
  icon: { type: String },
  value: { type: Number },
  rarity: { type: String },
  name: { type: String },
  description: { type: String }
});

module.exports = mongoose.model("item", itemSchema);