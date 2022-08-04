const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user: { type: String, unique: true },
  email: { type: String, unique: true },
  rsn: { type: String, unique: true },
  balance: { type: Number },
  password: { type: String },
  token: { type: String },
});

module.exports = mongoose.model("user", userSchema);