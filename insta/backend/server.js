import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./src/config/db.js";
import app from "./src/app.js";

connectDB();

let PORT = process.env.port || 4000;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
