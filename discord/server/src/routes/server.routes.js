import express from "express";
import { authmiddelware } from "../middlewares/auth.middleware.js";
import {
  createServer,
  deleteServer,
  generateinvitecode,
  getallserver,
  getMyServers,
  getServerByInviteCode,
  getServerdetail,
  joinServer,
  searchServer,
  transferOwnership,
  updateServer,
} from "../controllers/server.controller.js";
import upload from "../config/multer.js";
import {
  createServerValidator,
  deleteServerValidator,
  generateinvitecodeValidator,
  getServerByInviteCodeValidator,
  getServerDetailValidator,
  joinServerValidator,
  searchServerValidator,
  transferOwnershipValidator,
  updateServerValidator,
} from "../validators/server.validator.js";

const router = express.Router();

router.post(
  "/create",
  authmiddelware,
  upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  createServerValidator,
  createServer,
);

router.post(
  "/join/:inviteCode",
  authmiddelware,
  joinServerValidator,
  joinServer,
);

router.patch(
  "/:serverId/genrateInvitecode",
  authmiddelware,
  generateinvitecodeValidator,
  generateinvitecode,
);

router.patch(
  "/:serverId/transfer-ownership",
  authmiddelware,
  transferOwnershipValidator,
  transferOwnership,
);

router.get("/my-servers", authmiddelware, getMyServers);

router.get("/public", authmiddelware, getallserver);

router.get(
  "/invite/:inviteCode",
  getServerByInviteCodeValidator,
  getServerByInviteCode,
);

router.get(
  "/serverdetail/:serverId",
  authmiddelware,
  getServerDetailValidator,
  getServerdetail,
);

router.patch(
  "/updateServer/:serverId",
  authmiddelware,
  upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateServerValidator,
  updateServer,
);

router.delete(
  "/delete/:serverId",
  authmiddelware,
  deleteServerValidator,
  deleteServer,
);

router.get("/search", authmiddelware, searchServerValidator, searchServer);

export default router;
