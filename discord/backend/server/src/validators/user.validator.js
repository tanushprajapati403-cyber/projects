import { body, param, query } from "express-validator";
import { validate } from "../middlewares/validate.middleware.js";

export const getUserProfileValidator = [
  param("username").trim().notEmpty().withMessage("Username is required"),

  validate,
];

export const updateUserDetailValidator = [
  body("fullname")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Fullname cannot be empty"),

  body("mobile_no")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Mobile number cannot be empty"),

  body("dob")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format for date of birth (YYYY-MM-DD)"),

  body("bio").optional().trim(),

  validate,
];

export const changePasswordValidator = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),

  validate,
];

export const searchUserValidator = [
  query("query").trim().notEmpty().withMessage("Search query is required"),

  validate,
];

export const updateStatusValidator = [
  body("status").trim().notEmpty().withMessage("Status is required"),

  validate,
];
