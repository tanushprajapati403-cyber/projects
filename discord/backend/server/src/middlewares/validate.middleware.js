import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError";

export const validate = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return next(new ApiError(400, "validation error", error.array()));
  }

  next();
};
