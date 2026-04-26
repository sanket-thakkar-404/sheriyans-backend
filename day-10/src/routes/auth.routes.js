const express = require('express');
const authRoutes = express.Router();
const { registerUser} = require('../controller/auth.controller')



authRoutes.post('/register', registerUser)





module.exports = authRoutes;