import express from "express";
import { authmiddelware } from "../middlewares/auth.middleware";
import {
  createServer,
  deleteServer,
  generateinvitecode,
  getServerByInviteCode,
  getServerdetail,
  joinServer,
  transferOwnership,
  updateServer,
} from "../controllers/server.controller";
import upload from "../config/multer";

const router = express.Router();

router.post(
  "/create",
  authmiddelware,
  upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  createServer,
);

router.post("/join/:inviteCode", authmiddelware, joinServer);
router.patch(
  "/:serverId/genrateInvitecode",
  authmiddelware,
  generateinvitecode,
);
router.patch(
  "/:serverId/transfer-ownership",
  authmiddelware,
  transferOwnership,
);
router.get("/invite/:inviteCode", getServerByInviteCode);
router.get("/serverdetail/:serverId", authmiddelware, getServerdetail);

router.patch(
  "/updateServer/:serverId",
  authmiddelware,
  upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateServer,
);

router.delete("/delete/:serverId", authmiddelware, deleteServer);

export default router;
