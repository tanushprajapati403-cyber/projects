import express from "express";
import authRoutes from "../routes/auth.routes.js";
import userRoutes from "../routes/user.routes.js";
import serverRoutes from "../routes/server.routes.js";
import serverMemberRoutes from "../routes/serverMember.routes.js";
import roleRouter from "../routes/role.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/server", serverRoutes);
router.use("/serverMember", serverMemberRoutes);
router.use("/role", roleRouter);

export default router;
