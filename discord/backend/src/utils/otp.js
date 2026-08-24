import crypto from "crypto";

export const genrateOTP= ()=>{
const otp = crypto.randomInt(1000, 10000).toString();
}
