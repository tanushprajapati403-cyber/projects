import express from "express";
import { authmiddelware } from "../middlewares/auth.middleware.js";
import {
  creatreRole,
  deleteRole,
  getroleById,
  getServerRoles,
  updateRole,
} from "../controllers/role.controller.js";

const router = express.Router();

router.post("/create-role/:serverId", authmiddelware, creatreRole);
router.get("/roles/:serverId", authmiddelware, getServerRoles);
router.get("/:serverId/role/:roleId", authmiddelware, getroleById);
router.patch("/:serverId/role/:roleId", authmiddelware, updateRole);
router.delete("/:serverId/role/:roleId", authmiddelware, deleteRole);

export default router;
