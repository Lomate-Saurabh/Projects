import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { resolve } from "path";
const app = express();

// middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.static(resolve("./backend/public")));

//? routes
import userRouter from "../routes/user.routes.js";

app.use("/users", userRouter);

export default app;
