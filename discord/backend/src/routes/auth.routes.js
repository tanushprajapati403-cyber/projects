import express from "express";
import {
  googleUsercontroller,
  logincontroller,
  logoutUsercontroller,
  registercontroller,
  sendOTPcontroller,
  verifyOTPcontroller,
} from "../controllers/auth.controller.js";
import passport from "../config/passport.js";

const router = express.Router();

//normal authenticatio:-
router.post("/register", registercontroller);
router.post("/login", logincontroller);

//google authentication routes:-
router.get("/google", passport.authenticate("google", {scope: ["email", "profile"],prompt: "select_account",}));
router.get("/google/callback" , passport.authenticate("google" , {session : false}), googleUsercontroller);

//otp routes:-
router.post("/send-otp" , sendOTPcontroller );
router.post("/verify-otp" , verifyOTPcontroller);

//logout route:-
router.post("/logout", logoutUsercontroller);


export default router;
