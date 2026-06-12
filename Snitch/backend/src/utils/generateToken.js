// backend/src/utils/generateToken.js
import jwt from "jsonwebtoken";
import { ApiError } from "./apiError.js";

/**
 * Generate JWT Token
 *
 * @param {String} userId - MongoDB User ID
 * @param {String|null} sessionId - Optional session ID
 * @param {String} tokenSecret - JWT secret key
 * @param {String|Number} tokenExpire - Expiration time (e.g. "15m", "7d")
 * @returns {String} JWT Token
 */
export const generateToken = (
  userId,
  sessionId = null,
  tokenSecret,
  tokenExpire
) => {
  // Validate required parameters
  if (!userId) {
    throw new ApiError(400, null, "User ID is required");
  }

  if (!tokenSecret) {
    throw new ApiError(500, null, "Token secret is required");
  }

  if (!tokenExpire) {
    throw new ApiError(500, null, "Token expiration is required");
  }

  // Create payload
  const payload = {
    id: userId,
    sessionid: sessionId
  };

  // Add session only if provided
  if (sessionId) {
    payload.sessionid = sessionId;
  }

  // Generate token
  const token = jwt.sign(
    payload,
    tokenSecret,
    {
      expiresIn: tokenExpire,
    }
  );

  return token;
};

/**
 * Verify JWT Token
 * @param {String} token - JWT token
 * @param {String} tokenSecret - JWT secret key
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token, tokenSecret) => {
  // Check if token is provided
  if (!token) {
    throw new ApiError(
      401,
      null,
      "Authentication token is required"
    );
  }

  // Check if secret is provided
  if (!tokenSecret) {
    throw new ApiError(
      500,
      null,
      "Token secret is required"
    );
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, tokenSecret);
    return decoded;
  } catch (error) {
    // Token expired
    if (error.name === "TokenExpiredError") {
      throw new ApiError(
        401,
        null,
        "Token has expired"
      );
    }

    // Invalid token
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(
        401,
        null,
        "Invalid token"
      );
    }

    // Any other JWT error
    throw new ApiError(
      401,
      null,
      "Token verification failed"
    );
  }
};