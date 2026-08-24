import dotenv from "dotenv";
dotenv.config();
import redis from "../config/redis";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";

export const authmiddelware = async (req, res) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "token not found",
      });
    }

    const isTokenBlacklisted = await redis.get(
      `Bearer:accessToken:${accessToken}`,
    );

    if (!isTokenBlacklisted) {
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await userModel.findById(decode.id).select("-password");

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};
