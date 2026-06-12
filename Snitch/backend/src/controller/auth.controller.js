// controllers/auth.controller.js

import { refreshCookieOptions } from "../config/cookieOptions.js";
import config from "../config/dotenv.config.js";
import sessionModel from "../model/session.model.js";
import { loginLogic, refreshTokenLogic, registerLogic, verifyEmailLogic } from "../services/auth.service.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";
/**
 * Register Controller
 * Since we are using asyncHandler, there is NO need for:
 * - try...catch
 * - next(error)
 * asyncHandler automatically catches any rejected promise
 * and forwards the error to Express global error middleware.
 */
export const registerController = asyncHandler(async (req, res) => {
  const user = await registerLogic(req.body);
  return res.status(201).json(
    new ApiResponse(
      201,
      user,
      "User registered successfully"
    )
  );
});

export const loginController = asyncHandler(async (req, res) => {
  // console.log(req);
  const { loggedInUser, accessToken, refreshToken } = await loginLogic(req.body, req);
  res.cookie(
    "refreshToken",
    refreshToken,
    refreshCookieOptions
  );
  return res.status(200).json(
    new ApiResponse(
      200,
      { user: loggedInUser, accessToken },
      "User Login successfully"
    )
  );
});

export const verifyEmailController = asyncHandler(async (req, res) => {
  const { token } = req.params;
  await verifyEmailLogic({ token });
  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Email verified successfully"
    )
  );
}
);

export const refreshTokenController = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  // console.log(token)
  const { loggedInUser, accessToken } = await refreshTokenLogic({ token });
  return res.status(200).json(
    new ApiResponse(
      200,
      { user: loggedInUser, accessToken },
      "Access Token Generate successfully"
    )
  );
}
);

export const googleCallbackController = asyncHandler(async (req, res) => {
  const user = req.user

  const session = await sessionModel.create({
    user: user._id,
    refreshToken: "pending",
    ipAddress: req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress,
    userAgent: req.headers["user-agent"],
    expiresAt: new Date(
      Date.now() +
      7 * 24 * 60 * 60 * 1000
    ),
  })


  const refreshToken = generateToken(user._id, session._id, config.ACCESS_TOKEN_SECRET, config.ACCESS_TOKEN_EXPIRY)
  const accessToken = generateToken(user._id, session._id, config.ACCESS_TOKEN_SECRET, config.ACCESS_TOKEN_EXPIRY)

  session.refreshToken = refreshToken
  await session.save()

  res.cookie(
    "refreshToken",
    refreshToken,
    refreshCookieOptions
  );

  return res.status(200).json(
    new ApiResponse(200, { user, accessToken }, "Google Login Success")
  )
}
);