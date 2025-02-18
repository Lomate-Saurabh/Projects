import { Router } from "express";
import {
  user_signup_route,
  user_login_route,
  user_logout_route,
  get_allUsers,
  user_profile,
  update_userProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyUser, adminAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/dashboard", verifyUser, adminAuth, get_allUsers);

router.post("/auth/sign-up", upload.single("avatar"), user_signup_route);
router.post("/auth/login", user_login_route);
router.post("/auth/logout", verifyUser, user_logout_route);

router.get("/profile", verifyUser, user_profile);
router.patch(
  "/profile/update",
  verifyUser,
  upload.single("avatar"),
  update_userProfile
);

export default router;
