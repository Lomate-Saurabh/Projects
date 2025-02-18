import User from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const user_signup = asyncHandler(async (req, res) => {
  // get info
  // check all info is there
  // ckeck if their is already existed user with this credentials
  //upload avatar on cloudinary
  //create user
  //check user created or not
  //
  const { username, email, password } = req.body;

  if ([username, email, password].some((value) => value.trim === ""))
    throw new ApiError(400, "All fields are required");

  const user_exists = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (user_exists)
    throw new ApiError(400, "user already exists with this credentials");

  const localfilePath = req.file?.path;
  // console.log(req.file);

  if (!localfilePath) throw new ApiError(400, "local file path not found");

  const avatar_url = await uploadOnCloudinary(localfilePath);
  console.log(avatar_url);

  if (!avatar_url)
    throw new ApiError(
      400,
      "error occured during uploading file on cloudinary"
    );

  const user = await User.create({
    username,
    email,
    password,
    avatar: avatar_url.url || "",
  });

  const created_user = await User.findOne({ _id: user._id }).select(
    "-password -refreshToken"
  );

  if (!created_user) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  res
    .status(201)
    .json(new ApiResponse(201, created_user, "user registered successfully !"));
});

export { user_signup };
