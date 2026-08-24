import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/auth.routes.js"
import passport from "./config/passport.js";
import morgan from "morgan";

const app = express();
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth" , authRoutes);

export default app;
