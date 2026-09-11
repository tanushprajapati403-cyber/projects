import roleModel from "../models/role.model";
import serverModel from "../models/server.model";
import { createServerMember } from "../services/serverMember.services";
import { sendFile } from "../services/storage.services";
import { generateInviteCode } from "../utils/invitecode";
import ApiResponse from "../utils/ApiResponse";
import ApiError from "../utils/ApiError";
import serverMemberModel from "../models/servermember.model";

//Naya server create karta hai, owner set karta hai, aur automatically creator ko member/admin add karta hai.
export const createServer = async (req, res, next) => {
  try {
    const { name, description, isPublic } = req.body;

    const icon = req.files?.icon;

    const banner = req.files?.banner;

    let uploadIcon = null;
    if (icon) {
      uploadIcon = await sendFile(icon[0].buffer, icon[0].originalname);
    }
    let uploadBanner = null;
    if (banner) {
      uploadBanner = await sendFile(banner[0].buffer, banner[0].originalname);
    }

    const invitecode = generateInviteCode();

    const server = await serverModel.create({
      name,
      description,
      owner: req.user.id,
      icon: uploadIcon?.url || "",
      banner: uploadBanner?.url || "",
      isPublic,
      invitecode,
    });

    const ownerRole = await roleModel.create({
      name: "owner",
      server: server._id,
      permissions: [
        "MANAGE_SERVER",
        "MANAGE_CHANNELS",
        "MANAGE_ROLES",
        "MANAGE_MEMBERS",
        "MANAGE_MESSAGES",
      ],
      position: 100,
    });

    await createServerMember(req.user.id, server._id, [ownerRole._id]);

    return res
      .status(201)
      .json(new ApiResponse(201, server, "server created succesfully"));
  } catch (error) {
    next(error);
  }
};

//User ko invite code ke zariye server mein join karata hai aur Member model mein entry banata hai.
export const joinServer = async (req, res, next) => {
  try {
    const { invitecode } = req.params;

    const server = await serverModel.findOne({ invitecode });

    if (!server) {
      throw new ApiError(404, "invalid invite code");
    }

    //    const user = await userModel.findById(req.user.id)
    //         if (!user) throw new ApiError(404, "User not found");
    //         const alreadyExists = (user.server || []).some((serverId) =>
    //             serverId.toString() === server._id.toString()
    //         )
    //    if(alreadyExists) throw new ApiError(400,"you are already a member of this server")
    //                                    (or)

    // Agar aap sirf user ID se check karoge, toh system ko pata nahi chalega ki aap kis server ki baat kar rahe ho, kyunki wahi student kisi aur server mein bhi ho sakta hai.
    const existingMember = await serverMemberModel.findOne({
      user: req.user.id,
      server: server._id,
    });

    if (existingMember) {
      throw new ApiError(400, "You are already a member of this server");
    }
    // Agar aap join karte waqt roleModel . {create} likh doge, toh system har naye user ke liye ek naya "member" role banane lag jayega. Jabki Discord ya kisi bhi chat app mein ek hi "member" role hota hai jiske andar saare normal members ko rakha jata hai.
    // server: server._id aur name: "member" dono isliye ek sath use kiye jate hain taaki database ko exact pata chal sake ki aap kis server ke kis role ki talash kar rahe hain.
    const memberRole = await roleModel.findOne({
      server: server._id,
      name: "member",
    });

    if (!memberRole) {
      throw new ApiError(404, "Default member role not found");
    }

    await createServerMember(req.user._id, server._id, [memberRole._id]);

    return res
      .status(200)
      .json(new ApiResponse(200, server, "Server joined successfully"));
  } catch (error) {
    next(error);
  }
};

//Specific server ki details (name, banner, icon, description) fetch karta hai.
export const getServerdetail = async (req, res, next) => {
  try {
    const { serverId } = req.params;

    const server = await serverModel.findById(serverId);

    if (!server) {
      throw new ApiError(404, "server not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, server, "Server details fetched"));
  } catch (error) {
    next(error);
  }
};

// Server ki settings (name, description, icon, banner) update karta hai (Owner/Admin only).
export const updateServer = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const { name, description, isPublic } = req.body;

    const server = await serverModel.findById(serverId);
    if (!server) {
      throw new ApiError(404, "Server not found");
    }

    // Check if user is the owner
    if (server.owner.toString() !== req.user.id) {
      throw new ApiError(
        403,
        "Only the server owner can update server details",
      );
    }

    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (description !== undefined) updatedData.description = description;
    if (isPublic !== undefined) updatedData.isPublic = isPublic;

    // if (req.files?.icon?.[0]) {
    //   updatedData.icon = req.files.icon[0].url;
    // }
    // if (req.files?.banner?.[0]) {
    //   updatedData.banner = req.files.banner[0].url;
    // }
    //   or
    if (req.files?.icon?.[0]) {
      const file = req.files.icon[0];
      const uploadFile = await sendFile(file.buffer, file.originalname);
      updatedData.icon = uploadFile.url;
    }

    if (req.files?.banner?.[0]) {
      const file = req.files.banner[0];
      const uploadFile = await sendFile(file.buffer, file.originalname);
      updatedData.banner = uploadFile.url;
    }

    const updateServer = await serverModel.findByIdAndUpdate(
      serverId,
      updatedData,
      { new: true, runValidators: true },
    );

    return res
      .status(200)
      .json(new ApiResponse(200, updateServer, "Server updated successfully"));
  } catch (error) {
    next(error);
  }
};

//Server ko delete karta hai (Only Owner).
export const deleteServer = async (req, res, next) => {
  try {
    const { serverId } = req.params;

    const server = await serverModel.findById(serverId);

    if (!server) {
      throw new ApiError(404, "Server not found");
    }

    if (server.owner.toString() !== req.user.id) {
      throw new ApiError(403, "Only the server owner can delete this server");
    }

    await serverModel.findByIdAndDelete(serverId);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Server deleted successfully"));
  } catch (error) {
    next(error);
  }
};

//Server ke liye naya invite code generate ya refresh karta hai.
export const generateinvitecode = async (req, res, next) => {
  try {
    const { serverId } = req.params;

    const server = await serverModel.findById(serverId);

    if (!server) {
      throw new ApiError(404, "server not found");
    }

    if (server.owner.toString() !== req.user.id) {
      throw new ApiError(
        403,
        "Only the server owner can reset the invite code",
      );
    }

    const newInviteCode = generateInviteCode();

    const updateServer = await serverModel.findByIdAndUpdate(
      serverId,
      { invitecode: newInviteCode },
      { new: true },
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, updateServer, "Invite code reset successfully"),
      );
  } catch (error) {
    next(error);
  }
};

//Jab koi user invite link par click karta hai, toh join karne se pehle server ka naam, icon, aur member count dekhne ke liye (preview).
export const getServerByInviteCode = async (req, res, next) => {
  try {
    const { invitecode } = req.params;

    const server = await serverModel
      .findOne({ invitecode })
      .select("name description icon banner isPublic");

    if (!server) {
      throw new ApiError(404, "Invalid or expired invite code");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, server, "Server preview fetched successfully"),
      );
  } catch (error) {
    next(error);
  }
};

export const transferOwnership = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const { newOwnerId } = req.body;

    const server = await serverModel.findById(serverId);

    if (!server) {
      throw new ApiError(404, "Server not found");
    }

    if (server.owner.toString() !== req.user.id) {
      throw new ApiError(
        403,
        "Only the current server owner can transfer ownership",
      );
    }

    if (server.owner.toString() === newOwnerId) {
      throw new ApiError(400, "You are already the owner of this server");
    }

    const newOwnerMember = await serverMemberModel.findOne({
      user: newOwnerId,
      server: serverId,
    });

    if (!newOwnerMember) {
      throw new ApiError(
        404,
        "The target user must be a member of this server",
      );
    }

    server.owner = newOwnerId;
    await server.save();

    return res
      .status(200)
      .json(new ApiResponse(200, server, "Ownership transferred successfully"));
  } catch (error) {
    next(error);
  }
};
