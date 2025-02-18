import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import ApiError from "./ApiError.js";
import fs from "fs";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const uploadOnCloudinary = async (path) => {
  try {
    if (!path) return null;
    // console.log(process.env.API_KEY);

    const res = await cloudinary.uploader.upload(path, {
      resource_type: "auto",
      // public_id: filename,
    });
    fs.unlinkSync(path);
    return res;
  } catch (error) {
    fs.unlinkSync(path);
    throw new ApiError(400, error.message);
  }
};

export const deleteOnCloudinay = async (public_id) => {
  try {
    if (!public_id) throw new ApiError(400, "public id is undefined");
    return await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    throw new ApiError(error.message);
  }
};
