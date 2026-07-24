import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post('/', authMiddleware , createComment);

export default router;