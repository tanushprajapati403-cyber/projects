import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./src/config/db.js";
import app from "./src/app.js";
import { creatServerSocket } from "./src/utils/socketSetup.js";

connectDB();

// 2. Server create aur socket initialize kara:-
const server = creatServerSocket(app);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
