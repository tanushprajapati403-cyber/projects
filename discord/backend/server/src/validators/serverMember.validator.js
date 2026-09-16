import { body, param } from "express-validator";
import { validate } from "../middlewares/validate.middleware.js";

export const getServerMemberValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),

  validate,
];

export const getMyServerValidator = [
  param("userId").isMongoId().withMessage("Invalid user ID format"),

  validate,
];

export const leaveServerValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),

  validate,
];

export const removeMemberValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),
  param("userId").isMongoId().withMessage("Invalid user ID format"),

  validate,
];

export const updateMemberRoleValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),
  param("userId").isMongoId().withMessage("Invalid user ID format"),
  body("roleId")
    .trim()
    .notEmpty()
    .withMessage("Role ID is required")
    .isMongoId()
    .withMessage("Invalid role ID format"),

  validate,
];
