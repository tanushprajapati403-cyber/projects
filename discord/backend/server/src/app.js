import dotenv from "dotenv";
dotenv.config();
import express from "express";

import { globalmiddleware } from "./middlewares/global.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import apiRouter from "./routes/index.routes.js";

const app = express();

app.use(globalmiddleware);

app.use("/api", apiRouter);

app.use(errorMiddleware);

export default app;
