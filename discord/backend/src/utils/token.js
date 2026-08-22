import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const genreateToken = async (id, time) => {
  return jwt.sign({ id }, process.env.JWT_SECRATE, { expiresIn: time });
};
