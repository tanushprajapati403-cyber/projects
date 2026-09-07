import userModel from "../models/user.model.js";
import { sendFile } from "../services/storage.services.js";
import { genreateToken } from "../utils/token.js";
import bcrypt from "bcrypt";
import redis from "../config/redis.js";
import { sendEmail } from "../services/email.services.js";
import jwt from "jsonwebtoken";
import { genrateOTP } from "../utils/otp.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

//normal authentication:-
export const registercontroller = async (req, res, next) => {
  try {
    const { username, email, password, fullname, mobile_no, dob } = req.body;
    const file = req.file;

    if (!username || !email || !password || !fullname) {
      throw new ApiError(400, "All fields are required");
    }

    let uploadImage = null;

    if (file) {
      uploadImage = await sendFile(file.buffer, file.originalname);
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

    const accessToken = genreateToken(newUser._id, "15min");
    const refreshToken = genreateToken(newUser._id, "2d");

    res.cookie("accesToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: false,
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "strict",
    });

    return res
      .status(201)
      .json(new ApiResponse(201, null, "User registered successfully"));
  } catch (error) {
    next(error);
  }
};

export const logincontroller = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "every fields are required");
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.password || user.authProvider === "google") {
      throw new ApiError(400, "continue with google");
    }

    const checkpass = user.comparePass(password);

    if (!checkpass) {
      throw new ApiError(401, "invalid credential");
    }

    const accessToken = genreateToken(user._id, "15min");
    const refreshToken = genreateToken(user._id, "2d");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: false,
      sameSite: "strict",
    });

    let userData = user.toObject();
    delete userData.password;

    return res
      .status(200)
      .json(new ApiResponse(200, userData, "user are login"));
  } catch (error) {
    next(error);
  }
};

// google Authentication:-
export const googleUsercontroller = async (req, res, next) => {
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

      return res
        .status(200)
        .json(new ApiResponse(200, user, "user loggedin succssfully"));
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

    return res
      .status(201)
      .json(new ApiResponse(201, newUser, "user register successfully"));
  } catch (error) {
    next(error);
  }
};

//otp controllers forget password:-
export const sendOTPcontroller = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ApiError(400, "email is required");
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      throw new ApiError(404, "user is not found");
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

    return res
      .status(200)
      .json(new ApiResponse(200, null, "otp sent successfully"));
  } catch (error) {
    next(error);
  }
};

export const verifyOTPcontroller = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new ApiError(400, "email and otp is required");
    }

    const otpKey = `otp:${email}`;
    const attemptKey = `otp_attempts:${email}`;
    const data = await redis.get(otpKey);

    if (!data) {
      throw new ApiError(400, "OTP is expired or not found");
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

        throw new ApiError(
          429,
          "Too many invalid attempts. Please request a new OTP.",
        );
      }

      throw new ApiError(400, "OTP is invalid", [
        { attemptLeft: 5 - attempts },
      ]);
    }
    // OTP is successfully verified,
    // so delete the OTP and attempt counter from Redis
    await redis.del(otpKey);
    await redis.del(attemptKey);

    // Generate a JWT reset token with a 10-minute expiry for redis security
    const resetToken = genreateToken(userId, "10m");
    const hashedResetToken = bcrypt.hashSync(resetToken, "10");

    //redis mein set kara at the end.....
    await redis.set(
      `reset-token-hashedResetToken-${email}`,
      hashedResetToken,
      "EX",
      600,
    );

    return res
      .status(200)
      .json(new ApiResponse(200, resetToken, "OTP verified successfully"));
  } catch (error) {
    next(error);
  }
};

export const resetPasswordbyOTPcontroller = async (req, res, next) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      throw new ApiError(
        400,
        "email , resetPassword , newPassword are required",
      );
    }

    const hasedResetTokken = await redis.get(
      `reset-token-hashedResetToken-${email}`,
    );

    if (!hasedResetTokken) {
      throw new ApiError(
        400,
        "Your session for reset password is expired or invalid please try again..",
      );
    }

    // Optional: Agar token ko bcrypt se verify karna ho
    const isValidToken = bcrypt.compareSync(resetToken, hasedResetTokken);
    if (!isValidToken) {
      throw new ApiError(400, "Invalid reset token");
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(404, "user not found");
    }

    //password save it mongodb.
    user.password = newPassword;
    await user.save();

    // Kaam hone ke baad Redis se token hata do
    await redis.del(`reset-token-hashedResetToken-${email}`);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "password reset successfully"));
  } catch (error) {
    next(error);
  }
};

//logout controllers:-
export const logoutUsercontroller = async (req, res, next) => {
  try {
    //befor using redis three credential is required
    // ->host,port and password
    const { accessToken, refreshToken } = req.cookies;

    //blacklist mein dalrahe haiaccesToken , refreshToken:-
    if (accessToken) {
      await redis.set(
        `Bearer:accessToken:${accessToken}`,
        "true",
        "EX",
        15 * 60,
      );
    }
    if (refreshToken) {
      await redis.set(
        `Bearer:refreshToken:${refreshToken}`,
        "true",
        "EX",
        2 * 24 * 60 * 60,
      );
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res
      .status(200)
      .json(new ApiResponse(200, null, "user logout successfully"));
  } catch (error) {
    next(error);
  }
};

//refresh tokken for never login again to agian :-
export const resetToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new ApiError(401, "unauthorized");
    }

    const verifyRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await userModel.findById(verifyRefreshToken.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = genreateToken(user._id, "1m");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1 * 60 * 1000,
      secure: false,
      sameSite: "strict",
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "access token re-generated successfully"),
      );
  } catch (error) {
    next(error);
  }
};

//delete user every where:-
export const deleteUsercontroller = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const { password } = req.body;

    if (!password) {
      throw new ApiError(400, "Password is required to delete your account");
    }

    const user = await userModel.findById(userId).select("+password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = user.comparePass(password);

    if (!isPasswordValid) {
      throw new ApiError(400, "Incorrect password ! Account deletion failed. ");
    }

    // Database se user delete kar do
    await userModel.findByIdAndDelete(userId);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "Your account has been deleted successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

// normal email password change :-
export const forgetPasswordcontroller = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) throw new ApiError(400, "email is required");

    const user = await userModel.findOne({ email });

    if (!user) throw new ApiError(404, "user not found");

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
    return res
      .status(200)
      .json(new ApiResponse(200, null, "email sent successfully"));
  } catch (error) {
    next(error);
  }
};

export const resetPasswordcontroller = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new ApiError(400, "token and new password is required");
    }
    //Yeh line token ko verify karti hai ki wo asli hai aur expired to nahi hua. Agar token sahi hota hai
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      throw new ApiError(401, "unauthorize");
    }

    //token ke andar jo user ki ID mili thi (decoded.id), uska use karke database me us user ko dhoonda ja raha hai.
    const user = await userModel.findById(decoded.id);

    if (!user) {
      throw new ApiError(404, "user not found");
    }

    user.password = newPassword;

    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "password updated successfully"));
  } catch (error) {
    next(error);
  }
};
