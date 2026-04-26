const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  }
})



const userModel = mongoose.model("User", userSchema)

module.exports = userModel