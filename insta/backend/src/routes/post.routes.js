import express from "express";
import {
  createPostController,
  deletePostController,
  getAllPostController,
  updatePostController,
} from "../controllers/post.controller.js";
import { upload } from "../config/multer.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/create",
  authMiddleware,
  upload.array("images", 5),
  createPostController,
);
router.get("/", getAllPostController);
router.put("/update/:id", authMiddleware, updatePostController);
router.delete("/delete/:id", authMiddleware, deletePostController);

export default router;
