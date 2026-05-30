import { Router } from "express";

import {
  login,
  signup,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../../../controllers/auth.controller";

import { logout } from "../../../controllers/auth.controller";
import { authMiddleware } from "../../../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/login", login);

authRouter.post("/signup", signup);

authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/verify-otp", verifyOtp);

authRouter.post("/reset-password", resetPassword);

authRouter.post("/logout", authMiddleware, logout);

export default authRouter;