import dotenv from "dotenv";
dotenv.config();
import { cookie } from "express-validator";
import ApiError from "../utils/ApiError.js";
import redis from "../config/redis.js";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    //jab koi client (browser/frontend) Socket.io server se connect hone ki koshish karta hai, toh connection establish hone se theek pehle ek initial request bheji jata hai. Is process ko Socket.io Handshake kehte hain
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) {
      throw new ApiError(401, "authentication is required");
    }

    const accessToken = cookie
      .split(";")
      .find((cookie) => cookie.startsWith("accessToken="))
      ?.split("=")[1];
    if (!accessToken) {
      throw new ApiError(401, "unauthorized");
    }

    const isBlackListed = await redis.get(`Bearer:accessToken:${accessToken}`);
    if (!isBlackListed) {
      throw new ApiError(403, "token is invalid");
    }

    const decode = jwt.verify(accessToken, process.env.JWT_SECRET);

    console.log(decoded);

    const user = await userModel.findById(decode.id);
    if (!user) {
      throw new ApiError(404, "user not found");
    }

    socket.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
