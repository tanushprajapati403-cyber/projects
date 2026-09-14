import express from "express";
import { authmiddelware } from "../middlewares/auth.middleware.js";
import {
  getMyServer,
  getServerMember,
  leaveServer,
  removeMember,
  updateMemberRole,
} from "../controllers/serverMember.controller.js";

const router = express.Router();

router.get("/:serverId/members", authmiddelware, getServerMember);
router.get("/my-servers", authmiddelware, getMyServer);
router.delete("/:serverId/leave", authmiddelware, leaveServer);
router.delete("/:serverId/members/:userId", authmiddelware, removeMember);
router.patch(
  "/:serverId/members/:userId/role",
  authmiddelware,
  updateMemberRole,
);

export default router;
