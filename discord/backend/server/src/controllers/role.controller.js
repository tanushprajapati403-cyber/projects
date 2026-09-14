import roleModel from "../models/role.model.js";
import serverModel from "../models/server.model.js";
import serverMemberModel from "../models/servermember.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const creatreRole = async (req, res, next) => {
  try {
    const { serverId } = req.params;

    const { name, permissions, position, color } = req.body;

    const server = await serverModel.findById(serverId);

    if (!server) {
      throw new ApiError(404, "server not found");
    }

    const requesterMember = await serverMemberModel.findOne({
      user: req.user.id,
      server: serverId,
    });

    if (!requesterMember) {
      throw new ApiError(403, "You are not a member of this server");
    }

    if (
      !server.owner.equals(req.user.id) &&
      !requesterMember.role?.permissions?.includes("MANAGE_ROLES")
    ) {
      throw new ApiError(403, "You do not have permission to create roles");
    }

    const newRole = await roleModel.create({
      name,
      server: serverId,
      permissions,
      position,
      color,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newRole, "Role created successfully"));
  } catch (error) {
    next(error);
  }
};

export const getServerRoles = async (req, res, next) => {
  try {
    const { serverId } = req.params;

    const server = await serverModel.findById(serverId);

    if (!server) {
      throw new ApiError(404, "Server not found");
    }

    const requesterMember = await serverMemberModel.findOne({
      user: req.user.id,
      server: serverId,
    });

    if (!requesterMember) {
      throw new ApiError(403, "You are not a member of this server");
    }

    const roles = await roleModel
      .find({ server: serverId })
      .sort({ position: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, roles, "server roles fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const getroleById = async (req, res, next) => {
  try {
    const { serverId, roleId } = req.params;

    const server = await serverModel.findById(serverId);

    if (!server) {
      throw new ApiError(404, "Server not found");
    }

    const requesterMember = await serverMemberModel.findOne({
      user: req.user.id,
      server: serverId,
    });

    if (!requesterMember) {
      throw new ApiError(403, "You are not a member of this server");
    }
    const role = await roleModel.findOne({
      _id: roleId,
      server: serverId,
    });

    if (!role) {
      throw new ApiError(404, "Role not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, role, "Role fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { serverId, roleId } = req.params;

    const { name, permissions, color, position } = req.body;

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
      throw new ApiError(403, "You do not have permission to update roles");
    }

    const role = await roleModel.findOne({
      _id: roleId,
      server: serverId,
    });

    if (!role) {
      throw new ApiError(404, "role not found");
    }

    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (permissions !== undefined) updatedData.permissions = permissions;
    if (color !== undefined) updatedData.color = color;
    if (position !== undefined) updatedData.position = position;

    const roleUpdate = await roleModel.findOneAndUpdate(
      { _id: roleId, server: serverId },
      updatedData,
      { new: true, runValidators: true },
    );

    //                   (or)
    //if (name !== undefined) role.name = name;
    // if (permissions !== undefined) role.permissions = permissions;
    // if (color !== undefined) role.color = color;
    // if (position !== undefined) role.position = position;

    //  await role.save();

    return res
      .status(200)
      .json(new ApiResponse(200, roleUpdate, "Role updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const { serverId, roleId } = req.params;

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
      throw new ApiError(403, "You do not have permission to delete the role");
    }

    const role = await roleModel.findOne({
      _id: roleId,
      server: serverId,
    });

    if (!role) {
      throw new ApiError(404, "Role not found");
    }

    // Lowercase ka use kyu kara :- check taaki default roles safely block ho sakein
    if (
      role.name.toLowerCase() === "owner" ||
      role.name.toLowerCase() === "member"
    ) {
      throw new ApiError(404, "Default roles cannot be deleted");
    }

    await roleModel.findByIdAndDelete(roleId);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Role deleted successfully"));
  } catch (error) {
    next(error);
  }
};
