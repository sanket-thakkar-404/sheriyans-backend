// routes/auth.routes.js

import express from "express";
import { googleCallbackController, loginController, refreshTokenController, registerController, verifyEmailController } from "../controller/auth.controller.js";
import { loginValidator, registerValidator, refreshTokenValidator, verifyEmailValidator } from "../validators/auth.validator.js"
import passport from "passport";


const authRoutes = express.Router();


/**
 * Authentication Routes
 *
 * Route Flow:
 * 1. registerValidator -> validates req.body fields
 * 2. validate -> checks validation errors from express-validator
 * 3. registerController -> handles business logic
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
authRoutes.post(
  "/register",
  registerValidator, // express-validator rules
  registerController // controller logic
);
/**
 * @route   POST /api/auth/verify-email/:token
 * @desc    Verify User Email
 * @access  Public
 */

authRoutes.get(
  "/verify-email/:token",
  verifyEmailValidator,  // express-validator rules
  verifyEmailController     // controller logic
);

/**
 * @route   POST /api/auth/login
 * @desc    Login a  user
 * @access  Public
 */

authRoutes.post("/login",
  loginValidator,    // express-validator rules
  loginController    // controller logic
);

/**
 * @route   GET /api/auth/refresh-token
 * @desc    Generate New Access Token
 * @access  Public
 */

authRoutes.get(
  "/refresh-token",
  refreshTokenValidator, // express-validator rules
  refreshTokenController  // Controller Logic
);


authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
)

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  googleCallbackController
)


export default authRoutes;