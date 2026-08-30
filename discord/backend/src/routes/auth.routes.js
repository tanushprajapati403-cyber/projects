import express from "express";
import upload from "../config/multer.js";
import {
  deleteUsercontroller,
  forgetPasswordcontroller,
  googleUsercontroller,
  logincontroller,
  logoutUsercontroller,
  registercontroller,
  resetPasswordbyOTPcontroller,
  resetPasswordcontroller,
  resetToken,
  sendOTPcontroller,
  verifyOTPcontroller,
} from "../controllers/auth.controller.js";
import passport from "../config/passport.js";
import { authmiddelware } from "../middlewares/auth.middleware.js";

const router = express.Router();

//normal authenticatio:-
router.post("/register", upload.single("image"), registercontroller);
router.post("/login", logincontroller);

//google authentication routes:-
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleUsercontroller,
);

//otp routes:-
router.post("/send-otp", sendOTPcontroller);
router.post("/verify-otp", verifyOTPcontroller);
router.post("/resetpasswordbyOTP", resetPasswordbyOTPcontroller);

// forget and reset password by email:-
router.post("/forget-password", forgetPasswordcontroller);
router.post("/reset-password", resetPasswordcontroller);

//refreshToken:-
router.post("/refresh-token", resetToken);

//logout route:-
router.post("/logout", authmiddelware, logoutUsercontroller);

//delete user fully:-
router.post("/delete-user", authmiddelware, deleteUsercontroller);

export default router;
