import { ApiError } from "../utils/apiError.js";
import { validationResult } from "express-validator";
import { body, cookie, param } from "express-validator";



export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(
      400,
      "Validation failed",
      errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      }))
    );
  }
  next();
};


// =====================================================
// REUSABLE REGEX PATTERNS
// =====================================================

const NAME_REGEX = /^[a-zA-Z\s]+$/;
const COUNTRY_CODE_REGEX = /^\+\d{1,4}$/;
const MOBILE_NUMBER_REGEX = /^\d{6,15}$/;
const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
const PASSWORD_NUMBER_REGEX = /[0-9]/;
const PASSWORD_SPECIAL_REGEX = /[^A-Za-z0-9]/;

// =====================================================
// REGISTER VALIDATOR
// =====================================================

export const registerValidator = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters")
    .matches(NAME_REGEX)
    .withMessage("Name can only contain letters and spaces"),

  body("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("mobileNo.countryCode")
    .trim()
    .notEmpty()
    .withMessage("Country code is required")
    .matches(COUNTRY_CODE_REGEX)
    .withMessage("Please provide a valid country code (e.g. +91)"),

  body("mobileNo.number")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(MOBILE_NUMBER_REGEX)
    .withMessage("Please provide a valid mobile number"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 64 })
    .withMessage("Password must be between 8 and 64 characters")
    .matches(PASSWORD_UPPERCASE_REGEX)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(PASSWORD_LOWERCASE_REGEX)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(PASSWORD_NUMBER_REGEX)
    .withMessage("Password must contain at least one number")
    .matches(PASSWORD_SPECIAL_REGEX)
    .withMessage("Password must contain at least one special character"),

  body("avatar")
    .optional()
    .isString()
    .withMessage("Avatar must be a string"),

  body("role")
    .optional()
    .isIn(["user", "seller"])
    .withMessage("Role must be either user or seller"),

  body("isVerified")
    .optional()
    .isBoolean()
    .withMessage("isVerified must be a boolean"),


  validate,
];

// =====================================================
// LOGIN VALIDATOR
// =====================================================

export const loginValidator = [
  body("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 2 })
    .withMessage("Password cannot be empty"),

  validate,
];

// =====================================================
// REFRESH TOKEN VALIDATOR
// =====================================================

export const refreshTokenValidator = [
  cookie("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required"),

  validate,
];

// =====================================================
// CHANGE PASSWORD VALIDATOR
// =====================================================

export const changePasswordValidator = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Old password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8, max: 64 })
    .withMessage("Password must be between 8 and 64 characters")
    .matches(PASSWORD_UPPERCASE_REGEX)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(PASSWORD_LOWERCASE_REGEX)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(PASSWORD_NUMBER_REGEX)
    .withMessage("Password must contain at least one number")
    .matches(PASSWORD_SPECIAL_REGEX)
    .withMessage("Password must contain at least one special character"),

  body("confirmNewPassword")
    .notEmpty()
    .withMessage("Confirm new password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("New passwords do not match");
      }
      return true;
    }),

  body("newPassword").custom((value, { req }) => {
    if (value === req.body.oldPassword) {
      throw new Error(
        "New password must be different from old password"
      );
    }
    return true;
  }),
  validate,
];

// =====================================================
// FORGOT PASSWORD VALIDATOR
// =====================================================

export const forgotPasswordValidator = [
  body("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  validate,
];

// =====================================================
// RESET PASSWORD VALIDATOR
// =====================================================

export const resetPasswordValidator = [
  param("token")
    .notEmpty()
    .withMessage("Reset token is required")
    .isLength({ min: 10 })
    .withMessage("Invalid reset token"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8, max: 64 })
    .withMessage("Password must be between 8 and 64 characters")
    .matches(PASSWORD_UPPERCASE_REGEX)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(PASSWORD_LOWERCASE_REGEX)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(PASSWORD_NUMBER_REGEX)
    .withMessage("Password must contain at least one number")
    .matches(PASSWORD_SPECIAL_REGEX)
    .withMessage("Password must contain at least one special character"),

  body("confirmNewPassword")
    .notEmpty()
    .withMessage("Confirm new password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  validate,
];

// =====================================================
// VERIFY EMAIL VALIDATOR
// =====================================================

export const verifyEmailValidator = [
  param("token")
    .trim()
    .notEmpty()
    .withMessage("Verification token is required")
    .isLength({ min: 10 })
    .withMessage("Invalid verification token"),

  validate,
];
