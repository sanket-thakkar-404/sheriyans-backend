const bcrypt = require('bcrypt');
const userModel = require('../model/user.model')
const generateToken = require('../utils/generateToken')

module.exports.registerUser = async (req, res) => {
  try {
    const { email, fullname, password } = req.body;

    const existingUser = await userModel.findOne({ email })

    if (existingUser) return res.status(400).json({
      message: "User Already Existed"
    })

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      email,
      fullname,
      password: hash,
    })

    const token = generateToken(user._id, user.email);

    res.status(201).json({
      message: "User Created Successfully",
      user,
      token
    })
  } catch (err) {
    console.error('Error in Register Route :', err.message)
    res.status(500).json({ message: "internal server Error" })
  }

}

module.exports.userController = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({
      message: "All User Fetched successfully",
      users
    })
  } catch (err) {
    console.error('Error in fetching Users', err.message)
    res.status(500).json({ message: 'internal server error' })
  }
}