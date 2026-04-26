const generateToken = require('../utils/generateToken');
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')


module.exports.registerUser = async (req, res) => {
  try {
    const { email, password, fullname } = req.body

    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(409).json({
      message: "user already existed"
    })

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt)

    const user = await userModel.create({
      fullname,
      email,
      password: hash
    })

    const token = generateToken(user._id, user.email)
    res.cookie("token", token);

    res.status(201).json({ message: "user Created Successfully", token, user })
  } catch (err) {
    console.error('Error in Creating user', err.message)
    res.status(500).json({ message: "internal server error" })
  }
}