import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import passport from "./config/passport.js";
import morgan from "morgan";
import errorMiddleware from "./middlewares/error.middleware.js";
import serverRoutes from "./routes/server.routes.js";
import serverMemberRoutes from "./routes/serverMember.routes.js";

const app = express();
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/server", serverRoutes);
app.use("/api/serverMember", serverMemberRoutes);

app.use(errorMiddleware);

export default app;
