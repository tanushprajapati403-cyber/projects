import express from "express";
import { authmiddelware } from "../middlewares/auth.middleware";
import {
  createServer,
  getServerdetail,
  joinServer,
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

router.get("/:serverId", authmiddelware, getServerdetail);

router.patch(
  "/:serverId",
  authmiddelware,
  upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  updateServer,
);

export default router;
