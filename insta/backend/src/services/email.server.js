import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transpoter = nodemailer.createTransport({
  service: "gamil",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

transpoter.verify((error)=>{
  if(error){
    console.error("Email server connenction faild : ", error.message);
    return
  }
  console.log("email server is ready to send message");
})
