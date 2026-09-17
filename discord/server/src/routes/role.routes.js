import express from "express";
import { authmiddelware } from "../middlewares/auth.middleware.js";
import {
  creatreRole,
  deleteRole,
  getroleById,
  getServerRoles,
  updateRole,
} from "../controllers/role.controller.js";
import {
  creatreRoleValidator,
  deleteRoleValidator,
  getroleByIdValidator,
  getServerRolesValidator,
  updateRoleValidator,
} from "../validators/role.validator.js";

const router = express.Router();

router.post(
  "/create-role/:serverId",
  authmiddelware,
  creatreRoleValidator,
  creatreRole,
);
router.get(
  "/roles/:serverId",
  authmiddelware,
  getServerRolesValidator,
  getServerRoles,
);
router.get(
  "/:serverId/role/:roleId",
  authmiddelware,
  getroleByIdValidator,
  getroleById,
);
router.patch(
  "/:serverId/role/:roleId",
  authmiddelware,
  updateRoleValidator,
  updateRole,
);
router.delete(
  "/:serverId/role/:roleId",
  authmiddelware,
  deleteRoleValidator,
  deleteRole,
);

export default router;
