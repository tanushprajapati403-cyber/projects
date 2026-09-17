import crypto from "crypto";

export const genrateOTP= ()=>{
 return crypto.randomInt(1000, 10000).toString();
}
