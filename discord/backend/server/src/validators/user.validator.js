import { body, param, query } from "express-validator";

export const getUserProfileValidator = [
  param("username")
    .trim()
    .notEmpty()
    .withMessage("Username parameter is required"),
];

export const updateUserDetailValidator = [
  body("fullname")
    .optional({ values: "falsy" })
    .trim()
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

  body("bio")
    .optional({ values: "falsy" })
    .trim()
    .isLength({ max: 200 })
    .withMessage("Bio cannot exceed 200 characters"),

  body("profile_pic")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Invalid profile picture URL"),
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
    .withMessage("New password must be at least 6 characters"),
];

export const searchUserValidator = [
  query("query").trim().notEmpty().withMessage("Search query is required"),
];

export const updateStatusValidator = [
  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isLength({ max: 100 })
    .withMessage("Status cannot exceed 100 characters"),
];