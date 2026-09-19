import { body, param } from "express-validator";
import { validate } from "../middlewares/validate.middleware.js";

export const createChannelValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),

  body("name").trim().notEmpty().withMessage("Channel name is required"),

  body("type")
    .optional()
    .isIn(["text", "voice"])
    .withMessage("Channel type must be either text or voice"),

  body("topic").optional().trim(),

  body("position")
    .optional()
    .isNumeric()
    .withMessage("Position must be a number"),

  body("isPrivate")
    .optional()
    .isBoolean()
    .withMessage("isPrivate must be a boolean value"),

  body("category")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("Invalid category ID format"),

  validate,
];

export const getServerChannelsValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),

  validate,
];

export const getChannelByIdValidator = [
  param("channelId").isMongoId().withMessage("Invalid channel ID format"),

  validate,
];

export const UpdateChannelValidator = [
  param("channelId").isMongoId().withMessage("Invalid channel ID format"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Channel name cannot be empty"),

  body("type")
    .optional()
    .isIn(["text", "voice"])
    .withMessage("Channel type must be either text or voice"),

  body("topic").optional().trim(),

  body("position")
    .optional()
    .isNumeric()
    .withMessage("Position must be a number"),

  body("isPrivate")
    .optional()
    .isBoolean()
    .withMessage("isPrivate must be a boolean value"),

  validate,
];

export const deleteChannelValidator = [
  param("channelId").isMongoId().withMessage("Invalid channel ID format"),

  validate,
];

export const reorderChannelsValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),

  body("channels")
    .isArray({ min: 1 })
    .withMessage("Channels must be a non-empty array"),

  body("channels.*.id")
    .isMongoId()
    .withMessage("Each channel item must have a valid channel ID"),

  body("channels.*.position")
    .isNumeric()
    .withMessage("Each channel item position must be a number"),

  validate,
];

export const searchChannelsValidator = [
  param("serverId").isMongoId().withMessage("Invalid server ID format"),

  query("query").trim().notEmpty().withMessage("Search query is required"),

  validate,
];
