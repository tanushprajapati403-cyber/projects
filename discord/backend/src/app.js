import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/auth.routes.js"
import passport from "./config/passport.js";

const app = express();
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json());


app.use("/api/auth" , authRoutes);

export default app;
