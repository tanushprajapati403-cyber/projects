import express from "express";
import { authmiddelware } from "../middlewares/auth.middleware.js";
import {
  createChannel,
  deleteChannel,
  getChannelById,
  getServerChannels,
  reorderChannels,
  updateChannel,
} from "../controllers/channel.controller.js";
import {
  createChannelValidator,
  deleteChannelValidator,
  getChannelByIdValidator,
  getServerChannelsValidator,
  reorderChannelsValidator,
  UpdateChannelValidator,
} from "../validators/channel.validator.js";

const router = express.Router();

router.post(
  "/create-channel/:serverId",
  authmiddelware,
  createChannelValidator,
  createChannel,
);
router.get(
  "/channels/:serverId",
  authmiddelware,
  getServerChannelsValidator,
  getServerChannels,
);
router.get(
  "/channels/:channelId",
  authmiddelware,
  getChannelByIdValidator,
  getChannelById,
);
router.patch(
  "/channel/:channelId",
  authmiddelware,
  UpdateChannelValidator,
  updateChannel,
);
router.delete(
  "/channel/:channelId",
  authmiddelware,
  deleteChannelValidator,
  deleteChannel,
);
router.patch(
  "/channels/:serverId/reorder",
  authmiddelware,
  reorderChannelsValidator,
  reorderChannels,
);

export default router;
