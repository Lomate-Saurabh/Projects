import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyUser = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) throw new ApiError(400, "unauthorized request");
  //   console.log("accessToken :- ", accessToken);

  const userPayload = await jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );
  if (!userPayload) throw new ApiError(400, "token verification failed");
  //   console.log("userPayload :- ", userPayload);

  const user = await User.findOne({ _id: userPayload._id }).select(
    "-password -refreshToken"
  );
  if (!user)
    throw new ApiError(400, "Couldn't find user with this credentials..");
  //   console.log("User :- ", user);

  req.user = user;
  req.public_id = user.avatar;
  next();
});

const adminAuth = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  throw new ApiError(400, "unautorized access");
});

export { verifyUser, adminAuth };
