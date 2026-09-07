import { body } from "express-validator";

export const createServerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Server name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Server name must be between 2 and 50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters"),

  body("icon")
    .optional()
    .trim()
    .isURL()
    .withMessage("Icon must be a valid URL"),

  body("banner")
    .optional()
    .trim()
    .isURL()
    .withMessage("Banner must be a valid URL"),

  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean value"),
];
