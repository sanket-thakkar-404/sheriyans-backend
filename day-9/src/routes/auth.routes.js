const express = require('express');
const authRoutes = express.Router();
const { registerUser,userController } = require('../controller/auth.controller')



authRoutes.post('/register', registerUser)
authRoutes.get('/users' , userController)





module.exports = authRoutes;