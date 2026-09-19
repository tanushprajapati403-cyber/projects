import { body, param } from "express-validator";
import { validate } from "../middlewares/validate.middleware.js";

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

  validate,
];

export const joinServerValidator = [
  param("invitecode").trim().notEmpty().withMessage("Invite code is required"),

  validate,
];

export const getServerDetailValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),

  validate,
];

export const updateServerValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Server name must be between 2 and 50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters"),

  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean value"),

  validate,
];

export const deleteServerValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),

  validate,
];

export const generateinvitecodeValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),

  validate,
];

export const getServerByInviteCodeValidator = [
  param("invitecode").trim().notEmpty().withMessage("Invite code is required"),

  validate,
];

export const transferOwnershipValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),

  body("newOwnerId")
    .trim()
    .notEmpty()
    .withMessage("New owner ID is required")
    .isMongoId()
    .withMessage("Invalid new owner user ID format"),

  validate,
];

export const searchServerValidator = [
  query("query")
    .trim()
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({ min: 1 })
    .withMessage("Search query must be at least 1 character long"),

  validate,
];