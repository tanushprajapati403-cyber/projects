import express from "express";
import { authmiddelware } from "../middlewares/auth.middleware.js";
import {
  getMyServer,
  getServerMember,
  leaveServer,
  removeMember,
  updateMemberRole,
} from "../controllers/serverMember.controller.js";
import {
  getMyServerValidator,
  getServerMemberValidator,
  leaveServerValidator,
  removeMemberValidator,
  updateMemberRoleValidator,
} from "../validators/serverMember.validator.js";

const router = express.Router();

router.get(
  "/:serverId/members",
  authmiddelware,
  getServerMemberValidator,
  getServerMember,
);
router.get("/my-servers", authmiddelware, getMyServerValidator, getMyServer);

router.delete(
  "/:serverId/leave",
  authmiddelware,
  leaveServerValidator,
  leaveServer,
);
router.delete(
  "/:serverId/members/:userId",
  authmiddelware,
  removeMemberValidator,
  removeMember,
);
router.patch(
  "/:serverId/members/:userId/role",
  authmiddelware,
  updateMemberRoleValidator,
  updateMemberRole,
);

export default router;
