import userModel from "../models/user.model";
import { sendFile } from "../services/storage.services";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      throw new ApiError(404, "user not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "user found successfully"));
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await userModel.findOne({ username }).select("-password");

    if (!user) {
      throw new ApiError(404, "user not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "user found successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateUserDetail = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { fullname, mobile_no, dob, bio } = req.body;

    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (mobile_no) updateData.mobile_no = mobile_no;
    if (dob) updateData.dob = dob;
    if (bio !== undefined) updateData.bio = bio;

    const updateuser = await userModel
      .findByIdAndUpdate(userId, updateData, {
        new: true,
      })
      .select("-password");

    if (!updateuser) {
      throw new ApiError(404, "user not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updateuser, "user profile updated successfully"),
      );
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      throw new ApiError(400, "file is required");
    }

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const uploadFile = await sendFile(file.buffer, file.originalname);

    const updatedUser = await userModel
      .findByIdAndUpdate(
        userId,
        { profile_pic: uploadFile.url },
        { new: true, runValidators: true },
      )
      .select("-password");

    if (!updatedUser) {
      throw new ApiError(404, "user not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "profile pic updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
      throw new ApiError(400, "both fields are required");
    }

    if (password === newPassword) {
      throw new ApiError(409, "enter different password");
    }

    const user = await userModel.findById(userId).select("+password");

    if (!user) {
      throw new ApiError(404, "user details not found");
    }

    // Check karo ki Google auth wala user toh nahi hai (password na ho toh)
    if (!user.password) {
      throw new ApiError(
        400,
        "You logged in via Google, password change is not applicable.",
      );
    }

    const isPasswordMatched = user.comparePass(password);

    if (!isPasswordMatched) {
      throw new ApiError(400, "incorrect password");
    }

    user.password = newPassword;

    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "password changed successfully"));
  } catch (error) {
    next(error);
  }
};

export const searchUser = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      throw new ApiError(400, "search query required");
    }

    const user = await userModel
      .find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { fullname: { $regex: query, $options: "i" } },
        ],
      })
      .select("username fullname profile_pic");

    if (user.length === 0) {
      throw new ApiError(404, "user not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "user fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { status } = req.body;

    if (!status) {
      throw new ApiError(400, "Status are required");
    }

    const user = await userModel
      .findByIdAndUpdate(userId, { status }, { new: true, runValidators: true })
      .select("-password");

    if (!user) {
      throw new ApiError(404, "user not find");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Status updated successfully"));
  } catch (error) {
    next(error);
  }
};
