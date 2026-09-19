import express from "express";
import { authmiddelware } from "../middlewares/auth.middleware.js";
import {
  getMyServer,
  getServerMember,
  getSingleServerMember,
  leaveServer,
  removeMember,
  searchServerMembers,
  updateMemberRole,
} from "../controllers/serverMember.controller.js";
import {
  getMyServerValidator,
  getServerMemberValidator,
  SingleServerMemberValidator,
  leaveServerValidator,
  removeMemberValidator,
  searchServerMembersValidator,
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

router.get(
  "/:serverId/members/:userId",
  authmiddelware,
  SingleServerMemberValidator,
  getSingleServerMember,
);

router.get(
  "/:serverId/members/search",
  authmiddelware,
  searchServerMembersValidator,
  searchServerMembers,
);

export default router;
