import {
  Request,
  Response,
} from "express";

import {
  signupUser,
  verifyEmail,
  loginUser,
  getCurrentUser,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../services/auth.service.js";

import {
  AuthRequest,
} from "../middleware/auth.middleware.js";


// ==========================================
// SIGNUP
// ==========================================

export const signup = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = req.body;

    if (
      !firstName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "First name, email, password and confirm password are required",
      });
    }

    const result =
      await signupUser(
        firstName,
        lastName,
        email,
        password,
        confirmPassword
      );

    return res.status(201).json({
      success: true,
      ...result,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// VERIFY EMAIL
// ==========================================

export const verifyEmailController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        email,
        otp,
      } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message:
            "Email and OTP are required",
        });
      }

      const result =
        await verifyEmail(
          email,
          otp
        );

      return res.status(200).json({
        success: true,
        message:
          "Email verified successfully",
        ...result,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };


// ==========================================
// LOGIN
// ==========================================

export const login = async (
  req: Request,
  res: Response
) => {

  try {

    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const result =
      await loginUser(
        email,
        password
      );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });

  } catch (error: any) {

    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ME
// ==========================================

export const getMe = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const user =
      await getCurrentUser(
        req.user!.userId
      );

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error: any) {

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPasswordController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      const result =
        await forgotPassword(email);

      return res.status(200).json({
        success: true,
        ...result,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };


// ==========================================
// VERIFY RESET OTP
// ==========================================

export const verifyResetOtpController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        email,
        otp,
      } = req.body;

      if (!email || !otp) {
        return res.status(400).json({
          success: false,
          message:
            "Email and OTP are required",
        });
      }

      const result =
        await verifyResetOtp(
          email,
          otp
        );

      return res.status(200).json({
        success: true,
        ...result,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };


// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPasswordController =
  async (
    req: Request,
    res: Response
  ) => {

    try {

      const {
        email,
        otp,
        newPassword,
        confirmPassword,
      } = req.body;

      if (
        !email ||
        !otp ||
        !newPassword ||
        !confirmPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Email, OTP, new password and confirm password are required",
        });
      }

      const result =
        await resetPassword(
          email,
          otp,
          newPassword,
          confirmPassword
        );

      return res.status(200).json({
        success: true,
        ...result,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };