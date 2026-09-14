import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./server/src/config/db.js";
import app from "./server/src/app.js";

connectDB();

const port = process.env.PORT || 4000;

app.listen(port , ()=>{
    console.log(`server is running on port ${port}`)
}) 