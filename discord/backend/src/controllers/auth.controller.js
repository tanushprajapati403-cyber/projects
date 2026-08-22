import userModel from "../models/user.model.js";
import { sendFile } from "../services/storage.services.js";
import { genreateToken } from "../utils/token.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import redis from "../config/redis.js";
import { sendEmail } from "../services/email.services.js";

export const registercontroller = async (req, res) => {
  try {
    const { username, email, password, fullname, mobile_no, dob } = req.body;
    const file = req.file;

    if (!username || !email || !password || !fullname) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let uploadImage = null;

    if (file) {
      const uploadImage = await sendFile(file.buffer, file.originalname);
    }

    const newUser = await userModel.create({
      username,
      email,
      password,
      fullname,
      mobile_no,
      dob,
      profile_pic: uploadImage.url,
    });

    const accesToken = genreateToken(user_.id, "15min");
    const refreshToken = genreateToken(user_.id, "2d");

    res.cookie("accesToken", accesToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 100,
      secure: false,
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "strict",
    });

    return res.status(201).json({
      success: true,
      message: "user register succesfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal servcer error",
    });
  }
};

export const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "every fields are required",
      });
    }

    const user = await userModel.findOne({ email }).select("password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "every fields are required",
      });
    }

    if (!user.password || !user.authProvider === "google") {
      return res.status(400).json({
        success: false,
        message: "continue with google",
      });
    }

    const checkpass = comparePass(password);

    if (!checkpass) {
      return res.status(401).json({
        success: false,
        message: "invalid credential",
      });
    }

    const accessToken = genreateToken(user_.id, "15min");
    const refreshToken = genreateToken(user_.id, "2d");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 100,
      secure: false,
      sameSite: "strict",
    });

    let userData = user.toObject();
    delete userData.password;

    return res.status(201).json({
      success: true,
      message: "user are login",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal servcer error",
    });
  }
};

export const googleUsercontroller = async (req, res) => {
  try {
    const { email, name, given_name, picture, sub } = req.user._json;

    const user = await userModel.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = sub;
        await user.save();
      }
      const accessToken = genreateToken(user._id, "15min");
      const refreshToken = genreateToken(user._id, "2d");

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 2 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "user loggedin succssfully",
        user,
      });
    }

    const newUser = await userModel.create({
      username: given_name,
      fullname: name,
      email,
      profile_pic: picture,
      googleId: sub,
      authProvider: req.user.provider,
    });

    const accessToken = genreateToken(newUser._id, "15min");
    const refreshToken = genreateToken(newUser._id, "2d");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "user register successfully",
      newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const sendOTPcontroller = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email is required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user is not found",
      });
    }

    //genrate otp 4 no. ki :-
    const otp = crypto.randomInt(1000, 10000).toString();

    //hash otp for security reason :-
    const hashedotp = bcrypt.hashSync(otp, 10);

    // store otp in redis :-
    const otpKey = `otp:${email}`;

    //redis ke method hai save karne bali time control kar ke use :-
    await redis.set(
      otpKey,
      JSON.stringify({
        otp: hashedotp,
        userId: user._id.toString(),
      }),
      "EX",
      300,
    );

    //otp  attempt :-
    const attemptKey = `otp_attempts:${email}`;

    await redis.set(attemptKey, "0", "EX", 300);

    await sendEmail(
      email,
      "Password Reset OTP",
      `Your OTP is ${otp}. This OTP will expire in 5 minutes.`,

      ` <div>
            <h2>Password Reset</h2>

            <p>Your OTP is :</p>

              <h1>${otp}</h1>

              <p>If you did not request this OTP,
                  please ignore this email
              </p>   
              
          </div>`,
    );

    return res.status(200).json({
      success:true,
      message:"otp sent successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyOTPcontroller = async (req , res) => {
  try {
    const {email , otp } = req.body;

    if(!email , !otp) {
      return res.status(400).json({
        success:false,
        message:"email and otp is required"
      })
    };

    const otpKey  = `otp:${email}`;
    const attemptKey = `otpattempts:${email}`;
    const data = await redis.get(otpKey);

    if(!data){
      return res.status(400).json({
        success:false,
        message:"OTP is expired or not found"
      })
    };

    const {otp: hashedotp , userId} = JSON.parse(data);

    const isvalid = bcrypt.compareSync(otp , hashedotp);

    if(isvalid){
      
    }
    

  } catch (error) {
     return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}