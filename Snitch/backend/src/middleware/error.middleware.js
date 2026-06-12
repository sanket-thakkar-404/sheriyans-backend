// src/middleware/error.middleware.js

/**
 * Global Error Handling Middleware
 *
 * IMPORTANT:
 * 1. ES Modules me import path ke end me `.js` extension dena mandatory hai.
 * 2. `ApiError` ek class hai, function nahi.
 * 3. Isliye `ApiError({...})` call nahi kar sakte.
 * 4. Error response manually return karna hota hai.
 */

import config from "../config/dotenv.config.js";
import {ApiError} from "../utils/apiError.js";
// Agar tumne named export use kiya hai:
// import { ApiError } from "../utils/apiError.js";

const errorHandler = (err, req, res, next) => {
  /**
   * If incoming error is not an instance of ApiError,
   * fallback to default values.
   */
  const statusCode =
    err instanceof ApiError
      ? err.statusCode
      : err.statusCode || 500;

  const message =
    err instanceof ApiError
      ? err.message
      : err.message || "Internal Server Error";

  const errors =
    err instanceof ApiError
      ? err.errors
      : err.errors || [];

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors,
    stack:
     config.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });
};

export default errorHandler;