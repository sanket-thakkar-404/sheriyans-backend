// src/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js"
import Session from "../models/session.model.js";
import { apiError } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
  // 1. Token cookies ya Authorization header se lo
  const token =
    req.cookies?.accessToken ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  // 2. Token missing
  if (!token) {
    throw apiError({
      statusCode: 401,
      message: "Access token is missing",
    });
  }

  let decoded;

  // 3. JWT verify
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw apiError({
      statusCode: 401,
      message: "Invalid or expired access token",
    });
  }

  // 4. User not found
  const user = await userModel.findById(decoded._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // If email is NOT verified
  if (!user.isVerified) {
    throw new ApiError(
      403,
      "Please verify your email before logging in"
    );
  }
  // 5. Session validate
  const session = await Session.findOne({
    _id: decoded.sessionId,
    user: decoded.userId,
    isActive: true,
  });

  if (!session) {
    throw apiError({
      statusCode: 401,
      message: "Session is invalid or expired",
    });
  }

  // 6. Session expiry check (extra safety)
  if (session.expiresAt < new Date()) {
    session.isActive = false;
    await session.save();

    throw apiError({
      statusCode: 401,
      message: "Session has expired",
    });
  }

  // 7. User fetch
  const user = await userModel.findById(decoded.userId).select(
    "-password"
  );

  if (!user) {
    throw apiError({
      statusCode: 401,
      message: "User not found",
    });
  }

  // 8. Session last-used update
  session.lastUsedAt = new Date();
  await session.save();

  // 9. Request me authenticated data attach karo
  req.user = user;
  req.session = session;

  // 10. Next middleware/controller
  next();
});

export default authMiddleware;