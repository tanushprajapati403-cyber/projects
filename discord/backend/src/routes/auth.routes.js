import express from "express";
import {
  googleUsercontroller,
  logincontroller,
  registercontroller,
  sendOTPcontroller,
  verifyOTPcontroller,
} from "../controllers/auth.controller.js";
import passport from "../config/passport.js";

const router = express.Router();

router.post("/register", registercontroller);
router.post("/login", logincontroller);
router.get("/google", passport.authenticate("google", {scope: ["email", "profile"],prompt: "select_account",}));
router.get("/google/callback" , passport.authenticate("google" , {session : false}), googleUsercontroller);
router.post("/send-otp" , sendOTPcontroller );
router.post("/verify-otp" , verifyOTPcontroller);


export default router;
