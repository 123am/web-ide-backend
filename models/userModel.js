const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  privacyPolicy: { type: Boolean, require: true, default: false },
  createdOn: { type: Date, required: true, default: Date.now }
});

const User = mongoose.model("User", userSchema);

module.exports = User;