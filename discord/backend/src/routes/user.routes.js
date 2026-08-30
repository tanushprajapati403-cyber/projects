import express from "express";
import { authmiddelware } from "../middlewares/auth.middleware.js";
import {
  changePassword,
  getMe,
  getUserProfile,
  searchUser,
  updateUserDetail,
  updateUserProfile,
} from "../controllers/user.controller.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/getMe", authmiddelware, getMe);
router.patch("/update-profile", authmiddelware, updateUserDetail);
router.patch(
  "/update-profile-pic",
  authmiddelware,
  upload.single("profile_pic"),
  updateUserProfile,
);
router.patch("/chnage-password", authmiddelware, changePassword);
router.get("/search" , authmiddelware , searchUser);
router.get("/:username", authmiddelware, getUserProfile);

export default router;
