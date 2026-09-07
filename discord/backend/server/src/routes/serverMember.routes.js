import express from "express";
import { authmiddelware } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("serverMember/:serverid" , authmiddelware , )

export default router ;