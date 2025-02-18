import asyncHandler from "../utils/asyncHandler.js";
// import { v2 as cloudinary } from "cloudinary";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { deleteOnCloudinay, uploadOnCloudinary } from "../utils/Cloudinary.js";
import { hash } from "bcrypt";

// signup
const user_signup_route = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!(name || email || password))
    throw new ApiError(400, "All fields are require!");

  const isUserExist = await User.findOne({
    $or: [{ name: name }, { email: email }],
  });

  if (isUserExist)
    throw new ApiError(400, "the user already exist with this credentials");

  //? multer avatar
  // console.log(req.file);
  let avatar_path;
  let avatar_name;
  // const avatar_path = req.file?.path;
  if (req.file && req.file.path !== "") {
    avatar_path = req.file.path;
    avatar_name = req.file.filename;
    if (!avatar_path) throw new ApiError(400, "couldn't find file path");
  }
  let avatar;
  if (avatar_path) {
    // //
    // cloudinary.config({
    //   cloud_name: process.env.CLOUD_NAME,
    //   api_key: process.env.API_KEY,
    //   api_secret: process.env.API_SECRET,
    // });
    avatar = await uploadOnCloudinary(avatar_path);
    // console.log(avatar);

    if (!avatar) throw new ApiError(400, "couldn't find avatar");
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: avatar?.url,
  });

  const created_user = await User.findOne({ _id: user._id }).select(
    "-password -refreshToken"
  );

  if (!created_user)
    throw new ApiError(400, "couldn't register user in database");

  res
    .status(201)
    .json(new ApiResponse(201, created_user, "user registered successfully"));
});

// tokens
const generateAccessTokenAndRefreshToken = async (user) => {
  try {
    // if (!user_id) throw new ApiError(400, "invalid user_id");

    // const user = await User.findOne({ _id: user_id });
    // if (!user) throw new ApiError(400, "user not found of this user_id");

    if (!user) throw new ApiError(400, "invalid user");

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(400, error.message);
  }
};

// login
const user_login_route = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email || password)) throw new ApiError(400, "all inputs are require !");

  const user = await User.findOne({ email: email });
  if (!user) throw new ApiError(400, "please give valid credentials");

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(400, "Incorrect Password");

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user);
  // console.log(refreshToken);

  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  const userObj = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { userObj, accessToken: accessToken, refreshToken: refreshToken },
        "login successful.."
      )
    );
});

// logout
const user_logout_route = asyncHandler(async function (req, res) {
  const user = req.user;
  if (!user)
    throw new ApiError(400, "Couldn't find user with this credentials..");

  user.refreshToken = undefined;
  user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "logout successfully..."));
});

// allUsers
const get_allUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (!users) throw new ApiError(500, "unable to fetch users");
  res
    .status(200)
    .json(new ApiResponse(200, users, "fetched all users successfully.."));
});

// profile

const user_profile = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "user profile fetched successfully"));
});

// profile credentials update
const update_userProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body?.name) {
    user.name = req.body.name;
  }
  if (req.body?.email) {
    user.email = req.body.email;
  }

  if (req.body?.current_password) {
    const verifyPass = await user.isPasswordCorrect(req.body.current_password);
    if (!verifyPass) throw new ApiError(400, "incorrect password");

    if (!(req.body?.new_password && req.body?.confirm_password))
      throw new ApiError(400, "please pass new password and confirm password");
    if (!(req.body.new_password === req.body.confirm_password))
      throw new ApiError(
        400,
        "new password and confirm password should be same.."
      );

    user.password = req.body?.new_password;
    await user.save();
  }

  if (req.file && req.file?.path !== "") {
    const avatar_path = req.file?.path;
    const avatar_name = req.public_id;
    console.log("avatar_name", avatar_name);

    const url = avatar_name.split("/");
    const publicId = url[url.length - 1].replace(/\.jpg|\.png/gi, "");
    console.log(publicId);
    const res = await deleteOnCloudinay(publicId);
    // console.log(res); {result :ok}

    const avatar = await uploadOnCloudinary(avatar_path);
    if (!avatar) throw new ApiError(400, "couldn't upload avatar!");
    user.avatar = avatar?.url;
  }
  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(new ApiResponse(200, user, "user credentials updated successfull"));
});

export {
  user_signup_route,
  user_login_route,
  user_logout_route,
  get_allUsers,
  user_profile,
  update_userProfile,
};
