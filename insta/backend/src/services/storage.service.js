import dotenv from "dotenv";
dotenv.config();
import Imagekit from "imagekit";

const storageInstance = new Imagekit({
  urlEndpoint: process.env.IK_URL,
  privateKey: process.env.IK_PRI_KEY,
  publicKey: process.env.IK_PUB_KEY,
});

export const sendFiles = async (file, fileName) => {
  let obj = {
    file,
    fileName,
    folder: "kingsta",
  };

  return await storageInstance.upload(obj);
};
