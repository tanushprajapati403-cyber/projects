import serverMemberModel from "../models/servermember.model";

export const createServerMember = async (userId, serverId, roles = []) => {
  return await serverMemberModel.create({
    user: userId,
    server: serverId,
    roles,
  });
};
