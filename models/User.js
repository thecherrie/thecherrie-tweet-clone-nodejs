const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userSchema = mongoose.Schema({
  username: {type: String, unique: true},
  password: {type: String, required: true},
});

const User = mongoose.model("user", userSchema);
module.exports = User;
