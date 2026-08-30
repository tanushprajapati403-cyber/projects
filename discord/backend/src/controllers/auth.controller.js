import userModel from "../models/user.model.js";
import { sendFile } from "../services/storage.services.js";
import { genreateToken } from "../utils/token.js";
import bcrypt from "bcrypt";
import redis from "../config/redis.js";
import { sendEmail } from "../services/email.services.js";
import jwt from "jsonwebtoken";
import { genrateOTP } from "../utils/otp.js";

//normal authentication:-
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

    const accesToken = genreateToken(newUser._id, "15min");
    const refreshToken = genreateToken(newUser._id, "2d");

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

    const checkpass = user.comparePass(password);

    if (!checkpass) {
      return res.status(401).json({
        success: false,
        message: "invalid credential",
      });
    }

    const accessToken = genreateToken(user._id, "15min");
    const refreshToken = genreateToken(user._id, "2d");

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

// google Authentication:-
export const googleUsercontroller = async (req, res) => {
  try {
    const { email, name, given_name, picture, sub } = req.user._json;

    const user = await userModel.findOne({ email });

    console.log(req.user);
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

//otp controllers forget password:-
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
    const otp = genrateOTP();

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
      success: true,
      message: "otp sent successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export const verifyOTPcontroller = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      {
        return res.status(400).json({
          success: false,
          message: "email and otp is required",
        });
      }
    }

    const otpKey = `otp:${email}`;
    const attemptKey = `otpattempts:${email}`;
    const data = await redis.get(otpKey);

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "OTP is expired or not found",
      });
    }

    const { otp: hashedotp, userId } = JSON.parse(data);

    const isvalid = bcrypt.compareSync(otp, hashedotp);

    if (!isvalid) {
      const attempts = await redis.incr(attemptKey);

      // Set 5-minute expiry on the first failed attempt

      if (attempts === 1) {
        await redis.expire(attemptKey, 300);
      }

      // If user enters the wrong OTP 5 times,
      // delete the OTP and attempt counter from Redis

      if (attempts >= 5) {
        await redis.del(otpKey);
        await redis.del(attemptKey);

        return res.status(429).json({
          success: false,
          message: "Too many invalid attempts. Please request a new OTP.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "OTP is invalid",
        attemptLeft: 5 - attempts,
      });
    }
    // OTP is successfully verified,
    // so delete the OTP and attempt counter from Redis
    await redis.del(otpKey);
    await redis.del(attemptKey);

    // Generate a JWT reset token with a 10-minute expiry for redis security
    const resetToken = genreateToken(userId, "10");
    const hashedResetToken = bcrypt.hashSync(resetToken, "10m");

    //redis mein set kara at the end.....
    await redis.set(
      `reset-token-hashedResetToken-${email}`,
      hashedResetToken,
      "EX",
      600,
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resetPasswordbyOTPcontroller = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "email , resetPassword , newPassword are required",
      });
    }

    const hasedResetTokken = await redis.get(
      `reset-token-hashedResetToken-${email}`,
    );

    if (!hasedResetTokken) {
      return res.status(400).json({
        success: false,
        message:
          "Your session for reset password is expired or invalid please try again..",
      });
    }

    // Optional: Agar token ko bcrypt se verify karna ho
    const isValidToken = bcrypt.compareSync(resetToken, hasedResetTokken);
    if (!isValidToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    //password save it mongodb.
    user.password = newPassword;
    await user.save();

    // Kaam hone ke baad Redis se token hata do
    await redis.del(`reset-token-hashedResetToken-${email}`);

    return res.status(200).json({
      success: true,
      message: "password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//logout controllers:-
export const logoutUsercontroller = async (req, res) => {
  try {
    //befor using redis three credential is required
    // ->host,port and password
    const { accesToken, refreshToken } = req.cookie;

    //blacklist mein dalrahe haiaccesToken , refreshToken:-
    if (accesToken) {
      await redis.set(`Bearer:accessToken:${accesToken}`, "true");
    }
    if (refreshToken) {
      await redis.set(`Bearer:accessToken:${refreshToken}`, "true");
    }

    res.clearCookie("accesToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "user logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//refresh tokken for never login again to agian :-
export const resetToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "unauthorized",
      });
    }

    const verifyRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await userModel.findById(verifyRefreshToken.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const accessToken = genreateToken(user._id, "1m");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1 * 60 * 1000,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "access token re-generated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//delete user every where:-
export const deleteUsercontroller = async (req, res) => {
  try {
    const userId = req.user._Id;

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to delete your account",
      });
    }

    const user = await userModel.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = user.comparePass(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password ! Account deletion failed. ",
      });
    }

    // Database se user delete kar do
    await userModel.findByIdAndDelete(userId);

    res.clearCookie("accesToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Your account has been deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// normal email password change :-
export const forgetPasswordcontroller = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({
        success: false,
        message: "email is required",
      });

    const user = await userModel.findOne({ email });

    if (!user)
      return res.status(404).json({
        success: false,
        message: "user not found",
      });

    const resetToken = genreateToken(user._id, "10m");

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    await sendEmail(
      user.email,
      "Reset Your Kingsta Password",
      `Reset your password using this link: ${resetUrl}`,
      `
        <h2>Reset Your Password</h2>
        <p>Click the button below to reset your password.</p>

        <a href="${resetUrl}">
            Reset Password
        </a>

        <p>This link expires in 10 minutes.</p>
    `,
    );
    return res.status(200).json({
      success: true,
      message: "email sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resetPasswordcontroller = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "token and new password is required",
      });
    }
    //Yeh line token ko verify karti hai ki wo asli hai aur expired to nahi hua. Agar token sahi hota hai
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "unauthorize",
      });
    }

    //token ke andar jo user ki ID mili thi (decoded.id), uska use karke database me us user ko dhoonda ja raha hai.
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
