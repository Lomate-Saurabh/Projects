import { Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 8,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must contain at least 8 characters"],
    },
    avatar: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await hash(this.password, 10);
    next();
  } catch (error) {
    console.log(`error occured during hashing password ${error}`);
    next();
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  const payload = {
    _id: this._id,
    username: this.username,
    password: this.password,
  };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    algorithm: "SH256",
  });
};

const User = model("user", userSchema);

export default User;
