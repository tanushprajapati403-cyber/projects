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
import {
  deleteUserValidators,
  forgetPasswordValidators,
  loginValidators,
  registerValidator,
  resetPasswordbyOTPValidators,
  resetPasswordValidators,
  sendOTPValidators,
  verifyOTPValidators,
} from "../validators/auth.validator.js";

const router = express.Router();

//normal authenticatio:-
router.post(
  "/register",
  upload.single("image"),
  registerValidator,
  registercontroller,
);
router.post("/login", loginValidators, logincontroller);

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
  passport.authenticate("google", { session: false }),// some thinfg add faliureredirect 
  googleUsercontroller,
);

//otp routes:-
router.post("/send-otp", sendOTPValidators, sendOTPcontroller);
router.post("/verify-otp", verifyOTPValidators, verifyOTPcontroller);
router.post(
  "/resetpasswordbyOTP",
  resetPasswordbyOTPValidators,
  resetPasswordbyOTPcontroller,
);

// forget and reset password by email:-
router.post(
  "/forget-password",
  forgetPasswordValidators,
  forgetPasswordcontroller,
);
router.post(
  "/reset-password",
  resetPasswordValidators,
  resetPasswordcontroller,
);

//refreshToken:-
router.post("/refresh-token", resetToken);

//logout route:-
router.post("/logout", authmiddelware, logoutUsercontroller);

//delete user fully:-
router.post(
  "/delete-user",
  authmiddelware,
  deleteUserValidators,
  deleteUsercontroller,
);

export default router;
