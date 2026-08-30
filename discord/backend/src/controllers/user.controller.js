import userModel from "../models/user.model";
import { sendFile } from "../services/storage.services";

export const getMe = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user found successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await userModel.findOne({ username }).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user found successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateUserDetail = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullname, mobile_no, dob, bio , profile_pic} = req.body;

    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (mobile_no) updateData.mobile_no = mobile_no;
    if (dob) updateData.dob = dob;
    if (bio !== undefined) updateData.bio = bio;
    if (profile_pic !== undefined) updateData.profile_pic = profile_pic;

    const updateuser = await userModel
      .findByIdAndUpdate(userId, updateData, {
        new: true,
      })
      .select("-password");

    if (!updateuser) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user profile updated successfully",
      data: updateuser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "file is required",
      });
    }

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const uploadFile = await sendFile(file.buffer, file.originalname);

    user.profile_pic = uploadFile.url;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "profile pic updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "both fields are required",
      });
    }

    if (password === newPassword) {
      return res.status(409).json({
        success: false,
        message: "enter different password",
      });
    }

    const user = await userModel.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user details not found",
      });
    }

    // Check karo ki Google auth wala user toh nahi hai (password na ho toh)
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "You logged in via Google, password change is not applicable.",
      });
    }

    const isPasswordMatched = user.comparePass(password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "incorrect password",
      });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "search query required",
      });
    }

    const user = await userModel
      .find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { fullname: { $regex: query, $options: "i" } },
        ],
      })
      .select("username fullname profile_pic");

    if (user.length == 0) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status are required",
      });
    }

    const user = await userModel
      .findByIdAndUpdate(userId, { status }, { new: true, runValidators: true })
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not find",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
 