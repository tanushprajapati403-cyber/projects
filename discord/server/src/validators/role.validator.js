import { body, param } from "express-validator";
import { validate } from "../middlewares/validate.middleware.js";

export const creatreRoleValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),
  body("name").trim().notEmpty().withMessage("Role name is required"),
  body("permissions")
    .optional()
    .isArray()
    .withMessage("Permissions must be an array"),
  body("position")
    .optional()
    .isNumeric()
    .withMessage("Position must be a number"),
  body("color")
    .optional()
    .trim()
    .isString()
    .withMessage("Color must be a valid string"),

  validate,
];

export const getServerRolesValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),

  validate,
];

export const getroleByIdValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),
  param("roleId").isMongoId().withMessage("Invalid role ID format"),

  validate,
];

export const updateRoleValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),
  param("roleId").isMongoId().withMessage("Invalid role ID format"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Role name cannot be empty"),
  body("permissions")
    .optional()
    .isArray()
    .withMessage("Permissions must be an array"),
  body("color")
    .optional()
    .trim()
    .isString()
    .withMessage("Color must be a valid string"),
  body("position")
    .optional()
    .isNumeric()
    .withMessage("Position must be a number"),
  validate,
];

export const deleteRoleValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),
  param("roleId").isMongoId().withMessage("Invalid role ID format"),
  validate,
];
