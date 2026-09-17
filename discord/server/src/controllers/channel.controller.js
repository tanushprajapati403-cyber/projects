import channelModel from "../models/channel.model.js";
import serverModel from "../models/server.model.js";
import serverMemberModel from "../models/servermember.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createChannel = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const { name, type, topic, position, isPrivate } = req.body;

    const server = await serverModel.findById(serverId);
    if (!server) {
      throw new ApiError(404, "server not found");
    }

    const requesterMember = await serverMemberModel
      .findOne({ user: req.user._id, server: serverId })
      .populate("role");
    if (!requesterMember) {
      throw new ApiError(403, "You are not a member of this server");
    }

    if (
      !server.owner.equals(req.user._id) &&
      !requesterMember.role?.permissions?.includes("MANAGE_CHANNELS")
    ) {
      throw new ApiError(403, "You do not have permission to manage channels");
    }

    const existingChannel = await channelModel.findOne({
      server: serverId,
      name,
    });

    if (existingChannel) {
      throw new ApiError(
        409,
        "Channel with this name already exists in this server",
      );
    }

    const channel = await channelModel.create({
      name,
      type: type || "text",
      server: serverId,
      topic,
      position: position || 0,
      isPrivate: isPrivate || false,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, channel, "Channel created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getServerChannels = async (req, res, next) => {
  try {
    const { serverId } = req.params;

    const server = await serverModel.findById(serverId);
    if (!server) {
      throw new ApiError(403, "Server not found");
    }

    const requesterMember = await serverMemberModel.findOne({
      user: req.user._id,
      server: serverId,
    });
    if (!requesterMember) {
      throw new ApiError(403, "You are not a member of this server");
    }

    const channels = await channelModel
      .find({ server: serverId })
      .sort({ position: 1, createdAt: 1 });

    return res
      .status(200)
      .json(new ApiResponse(200, channels, "Channels fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getChannelById = async (req, res, next) => {
  try {
    const { channelId } = req.params;

    const channel = await channelModel.findById(channelId);
    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }

    const serverId = channel.server;
    const server = await serverModel.findById(serverId);
    if (!server) {
      throw new ApiError(403, "Server not found");
    }

    const requesterMember = await serverMemberModel
      .findOne({
        user: req.user._id,
        server: serverId,
      })
      .populate("role");
    if (!requesterMember) {
      throw new ApiError(403, "You are not a member of this server");
    }

    if (channel.isPrivate) {
      if (
        !server.owner.equals(req.user._id) &&
        !requesterMember.role?.permissions?.includes("MANAGE_CHANNELS")
      ) {
        throw new ApiError(403, "Access denied. This is a private channel.");
      }
    }

    return res
      .status(200)
      .json(new ApiResponse(200, channel, "Channel fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateChannel = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { name, type, topic, position, isPrivate } = req.body;

    const channel = await channelModel.findById(channelId);
    if (!channel) {
      throw new ApiError(404, "channel not found");
    }

    const serverId = channel.server;
    const server = await serverModel.findById(serverId);
    if (!server) {
      throw new ApiError(404, "server not found");
    }

    const requesterMember = await serverMemberModel
      .findOne({
        user: req.user._id,
        server: serverId,
      })
      .populate("role");
    if (!requesterMember) {
      throw new ApiError(403, "You are not a member of this server");
    }

    if (
      !server.owner.equals(req.user._id) &&
      !requesterMember.role?.permissions?.includes("MANAGE_CHANNELS")
    ) {
      throw new ApiError(403, "You do not have a member of this server");
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (type) updateData.type = type;
    if (topic != undefined) updateData.topic = topic;
    if (position != undefined) updateData.position = position;
    if (isPrivate != undefined) updateData.isPrivate = isPrivate;

    const updateChannel = await channelModel.findByIdAndUpdate(
      channelId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, updateChannel, "Channel updated successfully"),
      );
  } catch (error) {
    next(error);
  }
};

export const deleteChannel = async (req, res, next) => {
  try {
    const { channelId } = req.params;

    const channel = await channelModel.findById(channelId);
    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }

    const serverId = channel.server;
    const server = await serverModel.findById(serverId);
    if (!server) {
      throw new ApiError(404, "server not found");
    }

    const requesterMember = await serverMemberModel
      .findOne({
        user: req.user._id,
        server: serverId,
      })
      .populate("role");
    if (!requesterMember) {
      throw new ApiError(403, "You are not a member of this server");
    }

    if (
      !server.owner.equals(req.user._id) &&
      !requesterMember.role?.permissions?.includes("MANAGE_CHANNELS")
    ) {
      throw new ApiError(403, "You do not have permission to manage channels");
    }

    await channelModel.findByIdAndDelete(channelId);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Channel deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const reorderChannels = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const { channels } = req.body;

    if (!channels || !Array.isArray(channels) || channels.length === 0) {
      throw new ApiError(400, "Channels array is required for reordering");
    }

    const server = await serverModel.findById(serverId);
    if (!server) {
      throw new ApiError(404, "Server not found");
    }

    const requesterMember = await serverMemberModel
      .findOne({
        user: req.user._id,
        server: serverId,
      })
      .populate("role");
    if (!requesterMember) {
      throw new ApiError(403, "You are not a member of this server");
    }

    if (
      !server.owner.equals(req.user._id) &&
      !requesterMember.role?.permissions?.includes("MANAGE_CHANNELS")
    ) {
      throw new ApiError(403, "You do not have permission to manage channels");
    }

    //lekin database ke paas sirf ek hi request jaati hai jisme saari updates ek sath chali jaati hain
    const bulkOps = channels.map((item) => ({
      updateOne: {
        filter: { _id: item.id, server: serverId },
        update: { $set: { position: item.position } },
      },
    }));

    //Database par ek sath saari updates chalao
    await channelModel.bulkWrite(bulkOps);

    //            or

    //MongoDB ke paas alag-alag alag requests jaati hain (agar 10 channels hain, toh 10 alag queries chalengi).
    //   await Promise.all(
    // channels.map((item) =>
    //   channelModel.findOneAndUpdate(
    //     { _id: item.id, server: serverId },
    //     { position: item.position }
    //   )
    // )
    // );

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Channels reordered successfully"));
  } catch (error) {
    next(error);
  }
};
