import roleModel from "../models/role.model";
import serverModel from "../models/server.model";
import serverMemberModel from "../models/servermember.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

export const getServerMember = async (req, res, next) => {
  try {
    const { serverId } = req.params;

    const server = await serverModel.findById(serverId);

    if (!server) {
      throw new ApiError(404, "server not found");
    }

    const members = await serverMemberModel
      .find({ server: serverId })
      .populate("user", "username fullname profile_pic status")
      .populate("role", "name permissions position");

    return res
      .status(200)
      .json(
        new ApiResponse(200, members, "Server members fetched successfully"),
      );
  } catch (error) {
    next(error);
  }
};

export const getMyServer = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const memberships = await serverMemberModel
      .find({ user: userId })
      .populate("server");

    const servers = memberships.map((membership) => membership.server);

    return res
      .status(200)
      .json(new ApiResponse(200, servers, "User servers fetched successfully"));
  } catch (error) {
    next(error);
  }
};

//User khud ko server se leave kar sakta hai (Owner leave nahi kar sakta jab tak transfer na kare).
export const leaveServer = async (req, res, next) => {
  try {
    const { serverId } = req.params;

    const server = await serverModel.findById(serverId);

    if (!server) {
      throw new ApiError(404, "Server not found");
    }

    if (server.owner.toString() === req.user.id) {
      throw new ApiError(
        403,
        "Server owner cannot leave the server. Transfer ownership or delete the server instead.",
      );
    }

    const member = await serverMemberModel.findOneAndDelete({
      user: req.user.id,
      server: serverId,
    });

    if (!member) {
      throw new ApiError(404, "You are not a member of this server");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Successfully left the server"));
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { serverId, userId } = req.params;

    const server = await serverModel.findById(serverId);
    if (!server) {
      throw new ApiError(404, "Server not found");
    }

    if (!server.owner.equals(req.user.id)) {
      throw new ApiError(403, "Only the server owner can remove members");
    }

    const removeMember = await serverMemberModel.findOneAndDelete({
      user: userId,
      server: serverId,
    });

    if (!removeMember) {
      throw new ApiError(404, "Member not found in this server");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Member kicked successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateMemberRole = async (req, res, next) => {
  try {
    const { serverId, userId } = req.params;
    const { roleId } = req.body;

    const server = await serverModel.findById(serverId);
    if (!server) {
      throw new ApiError(404, "Server not found");
    }

    const requesterMember = await serverMemberModel
      .findOne({
        user: req.user.id,
        server: serverId,
      })
      .populate("role");

    if (!requesterMember) {
      throw new ApiError(403, "You are not a member of this server");
    }

    if (
      !server.owner.equals(req.user.id) &&
      !requesterMember.role?.permissions?.includes("MANAGE_ROLES")
    ) {
      throw new ApiError(403, "You do not have permission to manage roles");
    }

    const targetRole = await roleModel.findOne({
      _id: roleId,
      server: serverId,
    });

    if (!targetRole) {
      throw new ApiError(404, "Role not found in this server");
    }

    const updatedMember = await serverMemberModel
      .findOneAndUpdate(
        { user: userId, server: serverId },
        { role: roleId },
        { new: true },
      )
      .populate("user", "username fullname profile_pic status")
      .populate("role", "name permissions position");

    if (!updatedMember)
      throw new ApiError(404, "Member not found in this server");

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedMember, "Member role updated successfully"),
      );
  } catch (error) {
    next(error);
  }
};
