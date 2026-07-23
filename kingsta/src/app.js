import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(cookieParser);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users" , userRoutes);

export default app;