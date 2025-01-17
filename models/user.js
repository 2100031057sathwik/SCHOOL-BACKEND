const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});

const UserDetails = mongoose.model("users", userSchema);

module.exports = UserDetails;
