import serverModel from "../models/server.model";
import MemberModel from "../models/servermember.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

export const getServerMember = async (req, res, next) => {
  try {
    const { serverId } = req.params;

    const serverisExit = await serverModel.findById({ serverId });

    if (!serverisExit) {
      throw new ApiError(404, "server id is not found");
    }

    const servermemberisExited = await MemberModel.findOne({
      server: serverId,
    }).populate([
      {
        path: "users",
        select:
          "username fullname  email  dob  mobile_no  status  bio  profile_pic",
      },
      {
        path: "role",
        select: "",
      },
    ]);

    return res
      .status(201)
      .json(new ApiResponse("201", servermemberisExited, "all user detailed"));
  } catch (error) {
    next(error);
  }
};

