import { body } from "express-validator";
import { validate } from "../middlewares/validate.middleware.js";

export const registerValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("username must be between 3 and 20 charcters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("fullname")
    .notEmpty()
    .withMessage("Fullname is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Fullname must be between 2 and 50 characters"),

  body("mobile_no")
    .optional({ values: "falsy" })
    .trim()
    .isMobilePhone()
    .withMessage("Invalid mobile number")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be 10 digits"),

  body("dob")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format"),

  validate,
];

export const loginValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("password").trim().notEmpty().withMessage("Password is required"),

  validate,
];

export const sendOTPValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  validate,
];

export const verifyOTPValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 4, max: 4 })
    .withMessage("OTP must be 4 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),

  validate,
];

export const resetPasswordbyOTPValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  body("resetToken").trim().notEmpty().withMessage("Reset token is required"),

  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validate,
];

export const deleteUserValidators = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required to delete account"),

  validate,
];

export const forgetPasswordValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),

  validate,
];

export const resetPasswordValidators = [
  body("token").trim().notEmpty().withMessage("Token is required"),

  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validate,
];
