import { Router } from "express";

import {
  signup,
  verifyEmailController,
  login,
  getMe,
  forgotPasswordController,
  verifyResetOtpController,
  resetPasswordController,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();


// Authentication
router.post("/signup", signup);

router.post(
  "/verify-email",
  verifyEmailController
);

router.post("/login", login);

router.get(
  "/me",
  protect,
  getMe
);


// Password reset
router.post(
  "/forgot-password",
  forgotPasswordController
);

router.post(
  "/verify-reset-otp",
  verifyResetOtpController
);

router.post(
  "/reset-password",
  resetPasswordController
);

export default router;