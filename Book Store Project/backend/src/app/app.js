import express from "express";
import cors from "cors";
import { resolve } from "path";
import cookieParser from "cookie-parser";
import userRouter from "../routes/user.routes.js";

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.static(resolve("../public")));
app.use(cookieParser());

// routers
app.use("/user", userRouter);

export { app };
