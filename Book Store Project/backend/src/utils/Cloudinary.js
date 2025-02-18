import { v2 as cloudinary } from "cloudinary";
import ApiError from "./ApiError.js";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadOnCloudinary = async (localfilePath) => {
  try {
    if (!localfilePath || typeof localfilePath !== "string") {
      throw new ApiError(400, "file path is incorrect");
    }
    // console.log(localfilePath);

    const response = await cloudinary.uploader.upload(localfilePath, {
      resource_type: "auto",
    });

    if (!response || !response.secure_url) {
      throw new ApiError(500, "error occured uploading file on cloudinary");
    }

    fs.unlinkSync(localfilePath);
    // console.log(response);

    return response;
  } catch (error) {
    if (localfilePath) {
      try {
        fs.unlinkSync(localfilePath);
      } catch (error2) {
        console.log("error occured during deleting local file", error2);
      }
    }

    console.log("error occured during uploading file on cloudinary", error);

    return null;
  }
};

export { uploadOnCloudinary };
