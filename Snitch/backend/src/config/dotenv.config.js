/**
 * @file src/config/config.js
 * @description Centralized application configuration module.
 * Responsibilities:
 * 1. Loads environment variables from the `.env` file.
 * 2. Validates all required environment variables at startup.
 * 3. Exposes a single immutable configuration object.
 

 * Why this approach?
 * - Fails fast if any required configuration is missing.
 * - Prevents scattered `process.env` usage across the codebase.
 * - Improves maintainability and testability.
 * - Follows industry-standard backend architecture.
*/

import dotenv from "dotenv";

// Load environment variables from .env into process.env
dotenv.config();

/**
 * List of required environment variables.
 * The application will terminate during startup if any are missing.
*/
const REQUIRED_ENV_VARS = [
  // Server
  "PORT",

  // Frontend URL
  "FRONTEND_URL",

  // Database
  "MONGO_URL",

  // JWT Access Token
  "ACCESS_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRY",

  // JWT Refresh Token
  "REFRESH_TOKEN_SECRET",
  "REFRESH_TOKEN_EXPIRY",

  // Email Verification Token Secret
  "EMAIL_VERIFICATION_SECRET",
  "EMAIL_VERIFICATION_EXPIRY",

  // nodeEnvironment
  "NODE_ENV",

  // google credentials
  "GOOGLE_REFRESH_TOKEN",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_USER",
  "GOOGLE_CALLBACK_URL"
];

/**
 * Validate required environment variables.
 *
 * @throws {Error} If one or more environment variables are missing.
 */
function validateEnvironmentVariables() {
  const missingVariables = REQUIRED_ENV_VARS.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`
    );
  }
}

// Run validation immediately when this module is loaded
validateEnvironmentVariables();

/**
 * Immutable configuration object.
 *
 * Use this object throughout the application instead of directly
 * accessing `process.env`.
 */
const config = Object.freeze({
  // Server
  PORT: Number(process.env.PORT),

  // Frontend Url
  FRONTEND_URL: process.env.FRONTEND_URL,

  // Database
  MONGO_URL: process.env.MONGO_URL,

  // JWT Access Token
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,

  // JWT Refresh Token
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,

  // Email Verification Token Secret
  EMAIL_VERIFICATION_SECRET: process.env.EMAIL_VERIFICATION_SECRET,
  EMAIL_VERIFICATION_EXPIRY: process.env.EMAIL_VERIFICATION_EXPIRY,

  // node Environment
  NODE_ENV: process.env.NODE_ENV,

  // google mail 
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_USER: process.env.GOOGLE_USER,
  GOOGLE_CALLBACK_URL:process.env.GOOGLE_CALLBACK_URL,

});

export default config;