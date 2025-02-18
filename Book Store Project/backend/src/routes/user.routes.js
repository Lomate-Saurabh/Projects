import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { user_signup } from "../controllers/user.controllers.js";

const router = Router();

router.post("/signup", upload.single("avatar"), user_signup);

export default router;
