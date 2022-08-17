const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  _id: { type: String, unique: true },
  items: [{
    id: { type: Number },
    count: { type: Number }
  }]
});

module.exports = mongoose.model("inventory", inventorySchema);