import express from "express";
import { authmiddelware } from "../middlewares/auth.middleware.js";
import {
  changePassword,
  getMe,
  getUserProfile,
  searchUser,
  updateStatus,
  updateUserDetail,
  updateUserProfile,
} from "../controllers/user.controller.js";
import {
  changePasswordValidator,
  getUserProfileValidator,
  searchUserValidator,
  updateStatusValidator,
  updateUserDetailValidator,
} from "../validators/user.validator.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/getMe", authmiddelware, getMe);

router.patch(
  "/update-profile",
  authmiddelware,
  updateUserDetailValidator,
  updateUserDetail,
);

router.patch(
  "/update-profile-pic",
  authmiddelware,
  upload.single("profile_pic"),
  updateUserProfile,
);

router.patch(
  "/update-status",
  authmiddelware,
  updateStatusValidator,
  updateStatus,
);

router.patch(
  "/chnage-password",
  authmiddelware,
  changePasswordValidator,
  changePassword,
);

router.get("/search", authmiddelware, searchUserValidator, searchUser);

router.get(
  "/:username",
  authmiddelware,
  getUserProfileValidator,
  getUserProfile,
);

export default router;
